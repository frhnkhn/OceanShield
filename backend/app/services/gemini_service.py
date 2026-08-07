"""Server-side Gemini incident reasoning for completed report analysis."""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.report import Report

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def build_incident_prompt(report: Report) -> str:
    detections = (report.ai_results or {}).get("detections", [])
    detection_text = ", ".join(
        f"{item['label']} ({round(float(item['confidence']) * 100)}%)"
        for item in detections[:10]
    ) or "No objects detected by the prototype model."

    return f"""You are OceanShield's disaster-response assistant. Write a concise incident assessment for an authority dashboard.

Citizen report:
- Title: {report.title}
- Description: {report.description}
- Citizen-selected hazard: {report.hazard}
- Severity: {report.severity}/5
- Coordinates: {report.latitude}, {report.longitude}
- Prototype object detections: {detection_text}

Rules:
- Do not claim the object detections prove the reported hazard.
- State uncertainty clearly and recommend verification when evidence is limited.
- Do not give evacuation or emergency instructions.
- Write 2–4 short sentences, without markdown headings.
"""


def request_summary(prompt: str) -> str:
    if not GEMINI_API_KEY:
        raise RuntimeError("Gemini is not configured. Add GEMINI_API_KEY to backend/.env.")

    import requests

    response = requests.post(
        GEMINI_ENDPOINT.format(model=GEMINI_MODEL),
        headers={"x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json"},
        json={"contents": [{"parts": [{"text": prompt}]}]},
        timeout=30,
    )
    response.raise_for_status()
    payload: dict[str, Any] = response.json()
    candidates = payload.get("candidates", [])
    if not candidates:
        raise RuntimeError("Gemini returned no candidate response.")

    parts = candidates[0].get("content", {}).get("parts", [])
    summary = "".join(part.get("text", "") for part in parts).strip()
    if not summary:
        raise RuntimeError("Gemini returned an empty summary.")
    return summary[:2000]


def update_reasoning(
    db: Session,
    report: Report,
    *,
    status: str,
    summary: str | None = None,
    error: str | None = None,
) -> None:
    report.gemini_status = status
    report.gemini_summary = summary
    report.gemini_model = GEMINI_MODEL if status == "completed" else None
    report.gemini_error = error
    report.gemini_processed_at = datetime.now(timezone.utc) if status in {"completed", "failed", "not_configured"} else None
    db.commit()


def reason_about_report(report_id: int) -> None:
    """Background task entry point. The API key never leaves the backend."""
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if report is None or not report.image_url:
            return
        if not GEMINI_API_KEY:
            update_reasoning(db, report, status="not_configured", error="GEMINI_API_KEY is not configured.")
            return

        update_reasoning(db, report, status="processing")
        summary = request_summary(build_incident_prompt(report))
        update_reasoning(db, report, status="completed", summary=summary)
    except Exception as error:
        db.rollback()
        report = db.query(Report).filter(Report.id == report_id).first()
        if report is not None:
            update_reasoning(db, report, status="failed", error=str(error)[:1000])
    finally:
        db.close()

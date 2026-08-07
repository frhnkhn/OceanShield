"""Local, replaceable YOLO inference for report evidence images."""

from __future__ import annotations

import os
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from threading import Lock
from typing import TYPE_CHECKING, Any, Protocol
from uuid import uuid4

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.report import Report

STATIC_DIR = Path(__file__).resolve().parents[1] / "static" / "analysis"
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", "yolo11n.pt")
_model: "ObjectDetector | None" = None
_model_lock = Lock()

if TYPE_CHECKING:
    from PIL import Image


class ObjectDetector(Protocol):
    model_name: str

    def analyze(self, image: Any) -> tuple[list[dict[str, Any]], Any]: ...


class UltralyticsDetector:
    """YOLO adapter. Replace this class when trained coastal-hazard weights are ready."""

    def __init__(self, model_path: str) -> None:
        try:
            from ultralytics import YOLO
        except ImportError as error:
            raise RuntimeError(
                "YOLO is not installed. Run: pip install -r requirements.txt"
            ) from error

        self.model = YOLO(model_path)
        self.model_name = Path(model_path).name

    def analyze(self, image: Any) -> tuple[list[dict[str, Any]], Any]:
        result = self.model(image, verbose=False)[0]
        names = result.names
        detections: list[dict[str, Any]] = []

        for box in result.boxes:
            class_index = int(box.cls[0].item())
            detections.append(
                {
                    "label": str(names[class_index]),
                    "confidence": round(float(box.conf[0].item()), 4),
                    "bounding_box": [round(float(value), 2) for value in box.xyxy[0].tolist()],
                }
            )

        annotated_bgr = result.plot()
        from PIL import Image

        annotated_image = Image.fromarray(annotated_bgr[:, :, ::-1])
        return detections, annotated_image


def get_detector() -> ObjectDetector:
    global _model
    with _model_lock:
        if _model is None:
            _model = UltralyticsDetector(MODEL_PATH)
        return _model


def download_image(image_url: str) -> Any:
    import requests
    from PIL import Image

    response = requests.get(image_url, timeout=20)
    response.raise_for_status()
    image = Image.open(BytesIO(response.content))
    image.verify()
    return Image.open(BytesIO(response.content)).convert("RGB")


def save_annotated_image(image: Any, report_id: int) -> str:
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"report-{report_id}-{uuid4().hex}.jpg"
    image.save(STATIC_DIR / filename, "JPEG", quality=88)
    return f"/static/analysis/{filename}"


def update_analysis(
    db: Session,
    report: Report,
    *,
    status: str,
    results: dict[str, Any] | None = None,
    model: str | None = None,
    error: str | None = None,
) -> None:
    report.ai_status = status
    report.ai_results = results
    report.ai_model = model
    report.ai_error = error
    report.ai_processed_at = datetime.now(timezone.utc) if status in {"completed", "failed"} else None
    db.commit()


def analyze_report(report_id: int) -> None:
    """Background task entry point; owns its database session."""
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if report is None or not report.image_url:
            return

        update_analysis(db, report, status="processing")
        image = download_image(report.image_url)
        detector = get_detector()
        detections, annotated_image = detector.analyze(image)
        annotated_url = save_annotated_image(annotated_image, report.id)
        from app.services.verification_service import calculate_verification
        verification = calculate_verification(db, report.id)

        update_analysis(
            db,
            report,
            status="completed",
            model=detector.model_name,
            results={
                "detections": detections,
                "annotated_image_url": annotated_url,
                "image_width": image.width,
                "image_height": image.height,
                "verification_score": verification["score"],
                "verification_status": verification["status"],
                "verification_factors": verification["factors"]
            },
        )
        from app.services.gemini_service import reason_about_report

        reason_about_report(report_id)
    except Exception as error:
        db.rollback()
        report = db.query(Report).filter(Report.id == report_id).first()
        if report is not None:
            update_analysis(db, report, status="failed", error=str(error)[:1000])
        from app.services.gemini_service import reason_about_report

        reason_about_report(report_id)
    finally:
        db.close()

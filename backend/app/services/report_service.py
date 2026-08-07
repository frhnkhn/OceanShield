from sqlalchemy.orm import Session

from app.models.report import Report
from app.schemas.report import ReportCreate
from app.services.weather_service import fetch_weather


def create_report(db: Session, report: ReportCreate):
    # Fetch weather data snapshot
    weather_info = fetch_weather(report.latitude, report.longitude)

    new_report = Report(
        title=report.title,
        description=report.description,
        hazard=report.hazard,
        severity=report.severity,
        latitude=report.latitude,
        longitude=report.longitude,
        image_url=report.image_url,
        ai_status="queued" if report.image_url else "not_requested",
        gemini_status="queued" if report.image_url else "not_requested",
        weather_data=weather_info,
    )

    db.add(new_report)

    db.commit()

    db.refresh(new_report)

    return new_report


def get_report(db: Session, report_id: int):
    return db.query(Report).filter(Report.id == report_id).first()

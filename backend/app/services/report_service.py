from sqlalchemy.orm import Session

from app.models.report import Report
from app.schemas.report import ReportCreate


def create_report(db: Session, report: ReportCreate):

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
    )

    db.add(new_report)

    db.commit()

    db.refresh(new_report)

    return new_report


def get_report(db: Session, report_id: int):
    return db.query(Report).filter(Report.id == report_id).first()

from sqlalchemy.orm import Session
from app.models.report import Report


def get_all_reports(db: Session):
    return db.query(Report).order_by(Report.created_at.desc()).all()

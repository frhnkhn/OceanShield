from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.report import ReportCreate, ReportResponse
from app.services.analysis_service import analyze_report
from app.services.gemini_service import reason_about_report
from app.services.report_service import create_report, get_report
from app.services.report_query import get_all_reports

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post("/", status_code=201)
async def add_report(
    report: ReportCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    saved = create_report(db, report)

    if saved.image_url:
        background_tasks.add_task(analyze_report, saved.id)

    return {
        "success": True,
        "message": "Report saved. Image analysis has been queued." if saved.image_url else "Report saved.",
        "report_id": saved.id,
        "ai_status": saved.ai_status,
    }


@router.get("/", response_model=list[ReportResponse])
async def read_reports(
    db: Session = Depends(get_db)
):
    reports = get_all_reports(db)

    return reports


@router.get("/{report_id}", response_model=ReportResponse)
async def read_report(report_id: int, db: Session = Depends(get_db)):
    report = get_report(db, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/{report_id}/reasoning", status_code=202)
async def retry_reasoning(
    report_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    report = get_report(db, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    if not report.image_url:
        raise HTTPException(status_code=400, detail="An evidence image is required for AI reasoning")

    report.gemini_status = "queued"
    report.gemini_error = None
    db.commit()
    background_tasks.add_task(reason_about_report, report.id)
    return {"report_id": report.id, "gemini_status": report.gemini_status}

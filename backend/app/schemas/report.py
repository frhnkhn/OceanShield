from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

class ReportCreate(BaseModel):
    title: str = Field(min_length=3, max_length=120)
    description: str = Field(min_length=5, max_length=2000)
    hazard: str = Field(min_length=2, max_length=80)
    severity: int = Field(ge=1, le=5)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    image_url: str | None = Field(default=None, max_length=2048)


class Detection(BaseModel):
    label: str
    confidence: float = Field(ge=0, le=1)
    bounding_box: list[float] = Field(min_length=4, max_length=4)


class AnalysisResults(BaseModel):
    detections: list[Detection] = Field(default_factory=list)
    annotated_image_url: str | None = None
    image_width: int | None = None
    image_height: int | None = None


class ReportResponse(ReportCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    created_at: datetime
    ai_status: Literal["not_requested", "queued", "processing", "completed", "failed"]
    ai_results: AnalysisResults | None = None
    ai_model: str | None = None
    ai_processed_at: datetime | None = None
    ai_error: str | None = None
    gemini_status: Literal["not_requested", "queued", "processing", "completed", "failed", "not_configured"]
    gemini_summary: str | None = None
    gemini_model: str | None = None
    gemini_processed_at: datetime | None = None
    gemini_error: str | None = None

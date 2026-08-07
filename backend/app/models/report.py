from sqlalchemy import Column, DateTime, Float, Integer, JSON, String
from sqlalchemy.sql import func

from app.database.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String, nullable=False)

    hazard = Column(String, nullable=False)

    severity = Column(Integer, nullable=False)

    latitude = Column(Float, nullable=False)

    longitude = Column(Float, nullable=False)

    image_url = Column(String, nullable=True)

    status = Column(String, default="Pending")

    ai_status = Column(String, nullable=False, default="not_requested")
    ai_results = Column(JSON, nullable=True)
    ai_model = Column(String, nullable=True)
    ai_processed_at = Column(DateTime(timezone=True), nullable=True)
    ai_error = Column(String, nullable=True)

    gemini_status = Column(String, nullable=False, default="not_requested")
    gemini_summary = Column(String, nullable=True)
    gemini_model = Column(String, nullable=True)
    gemini_processed_at = Column(DateTime(timezone=True), nullable=True)
    gemini_error = Column(String, nullable=True)

    weather_data = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ReportMedia(Base):
    __tablename__ = "report_media"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, nullable=False, index=True)
    media_type = Column(String, nullable=False, default="image") # image or video
    storage_url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    original_filename = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())


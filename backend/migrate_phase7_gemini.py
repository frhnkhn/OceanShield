"""Add Phase 7 Gemini reasoning columns to the reports table. Safe to re-run."""

from sqlalchemy import text

from app.database.database import engine

STATEMENTS = [
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS gemini_status VARCHAR NOT NULL DEFAULT 'not_requested'",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS gemini_summary VARCHAR",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS gemini_model VARCHAR",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS gemini_processed_at TIMESTAMP WITH TIME ZONE",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS gemini_error VARCHAR",
]

with engine.begin() as connection:
    for statement in STATEMENTS:
        connection.execute(text(statement))

print("Phase 7 Gemini reasoning columns are ready.")

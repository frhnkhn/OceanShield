"""Add Phase 6 AI columns to an existing PostgreSQL reports table.

Safe to run more than once. New installations can continue using create_tables.py.
"""

from sqlalchemy import text

from app.database.database import engine

STATEMENTS = [
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS ai_status VARCHAR NOT NULL DEFAULT 'not_requested'",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS ai_results JSON",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS ai_model VARCHAR",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMP WITH TIME ZONE",
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS ai_error VARCHAR",
]

with engine.begin() as connection:
    for statement in STATEMENTS:
        connection.execute(text(statement))

print("Phase 6 report-analysis columns are ready.")

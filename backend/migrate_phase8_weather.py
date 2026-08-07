"""Add Phase 8 Weather columns to the reports table. Safe to re-run."""

from sqlalchemy import text

from app.database.database import engine

STATEMENTS = [
    "ALTER TABLE reports ADD COLUMN IF NOT EXISTS weather_data JSON",
]

with engine.begin() as connection:
    for statement in STATEMENTS:
        connection.execute(text(statement))

print("Phase 8 weather columns are ready.")

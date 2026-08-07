from app.database.database import engine, Base

# Import all models here
from app.models.report import Report

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Done!")
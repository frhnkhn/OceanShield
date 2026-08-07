from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers.health import router as health_router
from app.routers.reports import router as reports_router

app = FastAPI(
    title="OceanShield API",
    version="1.0.0"
)

# Allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(reports_router)
app.mount("/static", StaticFiles(directory="app/static", check_dir=False), name="static")


@app.get("/")
def root():
    return {
        "name": "OceanShield API",
        "status": "running"
    }

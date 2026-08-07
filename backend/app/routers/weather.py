from fastapi import APIRouter, HTTPException, Query
from app.services.weather_service import fetch_weather

router = APIRouter(
    prefix="/weather",
    tags=["Weather"]
)

@router.get("/")
async def get_live_weather(
    latitude: float = Query(..., description="Latitude of the location"),
    longitude: float = Query(..., description="Longitude of the location")
):
    try:
        data = fetch_weather(latitude, longitude)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

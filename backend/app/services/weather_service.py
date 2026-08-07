import requests
import logging

logger = logging.getLogger(__name__)

def fetch_weather(latitude: float, longitude: float) -> dict:
    """
    Fetches real-time weather metrics from the free Open-Meteo API.
    Returns a unified dict, falling back to safe mock/default values if the API is offline.
    """
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,wind_direction_10m",
            "timezone": "auto"
        }
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        current = data.get("current", {})
        
        # Determine wind direction label
        wind_deg = current.get("wind_direction_10m", 0)
        directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
        idx = round(wind_deg / 22.5) % 16
        wind_dir = directions[idx]

        return {
            "temp": current.get("temperature_2m", 25.0),
            "humidity": current.get("relative_humidity_2m", 80),
            "wind_speed": current.get("wind_speed_10m", 15.0),
            "wind_dir": wind_dir,
            "wind_deg": wind_deg,
            "rainfall": current.get("precipitation", 0.0),
            "tide_level": "Normal", # Open-Meteo does not provide tide, we can default or leave empty
            "cyclone_warning": current.get("wind_speed_10m", 15.0) > 60.0 or current.get("precipitation", 0.0) > 30.0,
            "cyclone_category": "Severe Depression" if current.get("wind_speed_10m", 15.0) > 80.0 else None,
            "fetched_at": data.get("current", {}).get("time")
        }
    except Exception as e:
        logger.error(f"Failed to fetch live weather from Open-Meteo: {e}")
        # Return fallback values
        return {
            "temp": 24.5,
            "humidity": 82,
            "wind_speed": 18.4,
            "wind_dir": "ENE",
            "wind_deg": 65,
            "rainfall": 2.5,
            "tide_level": "Normal",
            "cyclone_warning": False,
            "cyclone_category": None,
            "fetched_at": None,
            "error": str(e)
        }

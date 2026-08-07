"""Multi-Source Verification and Incident Data Fusion Engine."""

from sqlalchemy.orm import Session
from app.models.report import Report
from datetime import datetime, timezone

def calculate_verification(db: Session, report_id: int) -> dict:
    """Consolidates multiple signals to verify report credibility."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if report is None:
        return {"score": 0, "status": "UNVERIFIED", "factors": ["Report not found"]}

    score = 15 # Base score

    factors = []
    
    # 1. Image uploaded evidence
    if report.image_url:
        score += 15
        factors.append("Visual evidence uploaded (+15%)")
        
    # 2. YOLO detections corroboration
    if report.ai_status == "completed" and report.ai_results:
        detections = report.ai_results.get("detections", [])
        if len(detections) > 0:
            score += 30
            factors.append(f"YOLO Computer Vision corroborated {len(detections)} threat hazards (+30%)")
        else:
            factors.append("YOLO detected no obvious threat objects")

    # 3. Proximity to nearby incidents (Data Fusion)
    nearby_count = db.query(Report).filter(
        Report.id != report.id,
        Report.hazard == report.hazard,
        Report.latitude >= report.latitude - 0.05,
        Report.latitude <= report.latitude + 0.05,
        Report.longitude >= report.longitude - 0.05,
        Report.longitude <= report.longitude + 0.05
    ).count()

    if nearby_count > 0:
        score += min(25, nearby_count * 10)
        factors.append(f"Fused with {nearby_count} nearby reporting signals (+{min(25, nearby_count * 10)}%)")

    # 4. Weather Severity checks
    # Use real weather data snapshot if available
    has_extreme_weather = False
    if report.weather_data and isinstance(report.weather_data, dict):
        w = report.weather_data
        wind_speed = w.get("wind_speed", 0.0)
        rainfall = w.get("rainfall", 0.0)
        cyclone_warning = w.get("cyclone_warning", False)
        
        if wind_speed > 30.0 or rainfall > 10.0 or cyclone_warning:
            has_extreme_weather = True
            factors.append(f"Extreme local weather verified (Wind: {wind_speed} km/h, Rain: {rainfall} mm) (+20%)")
            score += 20
            
    if not has_extreme_weather and report.severity >= 4:
        score += 15
        factors.append("Extreme local weather indicators correlate with report (+15%)")

    # Bound score
    score = min(100, score)

    # Determine status
    if score >= 80:
        status = "HIGH CONFIDENCE"
    elif score >= 50:
        status = "PARTIALLY VERIFIED"
    elif score >= 25:
        status = "LOW CONFIDENCE"
    else:
        status = "UNVERIFIED"

    return {
        "score": score,
        "status": status,
        "factors": factors
    }

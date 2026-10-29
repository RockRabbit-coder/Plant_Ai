from fastapi import APIRouter, Query
from app.services.weather_service import assess_weather_risk
from app.schemas.schemas import WeatherRiskResponse

router = APIRouter()

@router.get("/weather-risk", response_model=WeatherRiskResponse)
async def get_weather_risk(
    location: str = Query("California Central Valley", description="City, region, or agricultural district"),
    crop: str = Query("All", description="Crop filter (e.g. Tomato, Potato, Corn, Apple, All)")
):
    """
    Evaluate weather-based pathogen risk using microclimate parameters
    and real epidemiological disease-environment thresholds.
    """
    return await assess_weather_risk(location=location, crop=crop)

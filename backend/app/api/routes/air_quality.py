from typing import List, Optional
from fastapi import APIRouter, Query, Depends
from backend.app.schemas.common import ApiResponse, ResponseMetadata
from backend.app.schemas.air_quality import (
    CurrentAirQuality, 
    AirQualityForecastResponse, 
    LocationComparisonItem
)
from backend.app.services.air_quality_service import air_quality_service
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/air", tags=["Air Quality"], dependencies=[Depends(check_rate_limit)])

@router.get("/current", response_model=ApiResponse[CurrentAirQuality])
async def get_current_air(
    lat: float = Query(28.5672, description="Latitude"),
    lon: float = Query(77.2100, description="Longitude"),
    location_name: str = Query("Delhi NCR", description="Location label"),
    standard: str = Query("IN_NAAQS", description="AQI Standard: IN_NAAQS, US_AQI, WHO_2021")
):
    data = await air_quality_service.get_current_air(lat, lon, location_name, standard)
    return ApiResponse.ok(
        data=data,
        metadata=ResponseMetadata(
            source=data.data_source,
            freshness="current",
            mode="demo" if data.is_demo else "live",
            confidence_score=data.confidence_score,
            provider=data.data_source
        )
    )

@router.get("/forecast", response_model=ApiResponse[AirQualityForecastResponse])
async def get_air_forecast(
    lat: float = Query(28.5672, description="Latitude"),
    lon: float = Query(77.2100, description="Longitude"),
    location_name: str = Query("Delhi NCR", description="Location label"),
    standard: str = Query("IN_NAAQS", description="AQI Standard")
):
    data = await air_quality_service.get_forecast(lat, lon, location_name, standard)
    return ApiResponse.ok(
        data=data,
        metadata=ResponseMetadata(
            source="AIRWISE Diurnal Atmospheric Projection Engine",
            freshness="recently_updated",
            confidence_score=92
        )
    )

@router.get("/location-comparison", response_model=ApiResponse[List[LocationComparisonItem]])
async def get_location_comparison():
    benchmarks = [
        LocationComparisonItem(id="delhi", name="Delhi NCR", sub_area="Anand Vihar & South Ext", country="India", aqi=284, risk_level="severe", primary="pm25", pm25=198.4),
        LocationComparisonItem(id="london", name="London", sub_area="Marylebone Road / Southwark", country="United Kingdom", aqi=68, risk_level="moderate", primary="no2", pm25=14.2),
        LocationComparisonItem(id="newyork", name="New York City", sub_area="Midtown Manhattan", country="United States", aqi=45, risk_level="low", primary="o3", pm25=8.5),
        LocationComparisonItem(id="tokyo", name="Tokyo", sub_area="Shinjuku basin", country="Japan", aqi=32, risk_level="low", primary="pm25", pm25=6.8),
        LocationComparisonItem(id="jakarta", name="Jakarta", sub_area="Central Jakarta", country="Indonesia", aqi=168, risk_level="high", primary="pm25", pm25=88.5)
    ]
    return ApiResponse.ok(data=benchmarks)

@router.get("/history", response_model=ApiResponse[List[dict]])
async def get_air_history():
    history_trend = [
        {"timestamp": "2026-11-20T08:00:00Z", "aqi": 298, "risk_level": "severe", "primary": "pm25"},
        {"timestamp": "2026-11-20T14:00:00Z", "aqi": 165, "risk_level": "moderate", "primary": "pm25"},
        {"timestamp": "2026-11-20T20:00:00Z", "aqi": 310, "risk_level": "severe", "primary": "pm25"},
        {"timestamp": "2026-11-21T08:00:00Z", "aqi": 284, "risk_level": "severe", "primary": "pm25"}
    ]
    return ApiResponse.ok(data=history_trend)

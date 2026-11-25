from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class PollutantConcentrations(BaseModel):
    pm25: Optional[float] = Field(None, description="PM2.5 in µg/m³")
    pm10: Optional[float] = Field(None, description="PM10 in µg/m³")
    o3: Optional[float] = Field(None, description="Ozone in ppb or µg/m³")
    no2: Optional[float] = Field(None, description="Nitrogen Dioxide in ppb or µg/m³")
    co: Optional[float] = Field(None, description="Carbon Monoxide in ppm or mg/m³")
    so2: Optional[float] = Field(None, description="Sulfur Dioxide in ppb or µg/m³")

class WeatherContext(BaseModel):
    temperature: float = 24.0
    humidity: float = 65.0
    wind_speed: float = 4.8
    wind_direction: str = "NW"
    condition: str = "Hazy Inversion Layer"
    uv_index: float = 4.0

class CurrentAirQuality(BaseModel):
    aqi: int
    standard: str = "IN_NAAQS"  # IN_NAAQS, US_AQI, WHO_2021
    risk_level: str             # low, moderate, high, severe
    primary_pollutant: str      # pm25, pm10, o3, no2, co, so2
    pollutants: PollutantConcentrations
    weather: WeatherContext
    timestamp: str
    location_name: str
    sub_area: Optional[str] = None
    latitude: float
    longitude: float
    confidence_score: int = 94
    active_sensors: int = 14
    outdoor_recommendation: str
    health_advisory: str
    data_source: str
    is_demo: bool = False

class HourlyForecastItem(BaseModel):
    hour: str
    aqi: int
    risk_level: str
    pm25: float
    wind_speed: float
    label: Optional[str] = None

class DailyForecastItem(BaseModel):
    day: str
    avg_aqi: int
    peak_aqi: int
    risk_level: str
    dominant_condition: str

class AirQualityForecastResponse(BaseModel):
    location_name: str
    standard: str
    hourly: List[HourlyForecastItem]
    daily: List[DailyForecastItem]

class LocationComparisonItem(BaseModel):
    id: str
    name: str
    sub_area: Optional[str] = None
    country: str
    aqi: int
    risk_level: str
    primary: str
    pm25: float

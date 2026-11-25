import time
from typing import Dict, Any, Optional
from backend.app.config import settings
from backend.app.schemas.air_quality import CurrentAirQuality, AirQualityForecastResponse
from backend.app.providers.air_quality.open_meteo import OpenMeteoAirQualityProvider
from backend.app.providers.air_quality.mock_provider import MockAirQualityProvider
from backend.app.core.logging import logger

class AirQualityService:
    def __init__(self):
        self.live_provider = OpenMeteoAirQualityProvider()
        self.mock_provider = MockAirQualityProvider()
        
        # In-memory TTL cache
        self._cache_current: Dict[str, Dict[str, Any]] = {}
        self._cache_forecast: Dict[str, Dict[str, Any]] = {}

    async def get_current_air(self, lat: float = 28.5672, lon: float = 77.2100, location_name: str = "Delhi NCR", standard: str = "IN_NAAQS") -> CurrentAirQuality:
        cache_key = f"{round(lat, 2)}_{round(lon, 2)}_{standard}"
        now = time.time()

        # Check Cache
        if cache_key in self._cache_current:
            cached = self._cache_current[cache_key]
            if now - cached["timestamp"] < settings.CACHE_TTL_AIR_QUALITY_SECONDS:
                return cached["data"]

        # Attempt Live Provider first if configured
        if settings.AIR_QUALITY_PROVIDER == "open_meteo":
            try:
                data = await self.live_provider.get_current(lat, lon, location_name, standard)
                self._cache_current[cache_key] = {"timestamp": now, "data": data}
                return data
            except Exception as e:
                logger.warning(f"Live air quality fetch failed ({e}), safely falling back to Calibrated Station Simulator.")

        # Fallback to Calibrated Ground Simulator
        data = await self.mock_provider.get_current(lat, lon, location_name, standard)
        self._cache_current[cache_key] = {"timestamp": now, "data": data}
        return data

    async def get_forecast(self, lat: float = 28.5672, lon: float = 77.2100, location_name: str = "Delhi NCR", standard: str = "IN_NAAQS") -> AirQualityForecastResponse:
        cache_key = f"fc_{round(lat, 2)}_{round(lon, 2)}_{standard}"
        now = time.time()

        if cache_key in self._cache_forecast:
            cached = self._cache_forecast[cache_key]
            if now - cached["timestamp"] < settings.CACHE_TTL_FORECAST_SECONDS:
                return cached["data"]

        if settings.AIR_QUALITY_PROVIDER == "open_meteo":
            try:
                data = await self.live_provider.get_forecast(lat, lon, location_name, standard)
                self._cache_forecast[cache_key] = {"timestamp": now, "data": data}
                return data
            except Exception as e:
                logger.warning(f"Live forecast failed ({e}), falling back to calibrated diurnal model.")

        data = await self.mock_provider.get_forecast(lat, lon, location_name, standard)
        self._cache_forecast[cache_key] = {"timestamp": now, "data": data}
        return data

air_quality_service = AirQualityService()

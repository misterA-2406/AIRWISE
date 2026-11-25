from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from backend.app.schemas.air_quality import CurrentAirQuality, AirQualityForecastResponse

class BaseAirQualityProvider(ABC):
    name: str = "BaseProvider"
    is_live: bool = True
    rate_limit_per_minute: int = 60
    documentation_url: str = ""
    licensing: str = ""

    @abstractmethod
    async def get_current(self, lat: float, lon: float, location_name: str, standard: str = "IN_NAAQS") -> CurrentAirQuality:
        """Fetch current air quality reading for coordinates."""
        pass

    @abstractmethod
    async def get_forecast(self, lat: float, lon: float, location_name: str, standard: str = "IN_NAAQS") -> AirQualityForecastResponse:
        """Fetch hourly and 5-day air quality forecast."""
        pass

    def get_provider_metadata(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "is_live": self.is_live,
            "rate_limit_per_minute": self.rate_limit_per_minute,
            "documentation_url": self.documentation_url,
            "licensing": self.licensing
        }

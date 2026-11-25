import secrets
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    API_V1_STR: str = "/api"

    # Frontend CORS
    FRONTEND_ORIGIN: str = "http://127.0.0.1:5173,http://localhost:5173"

    # Database
    DATABASE_URL: str = "sqlite:///./airwise.db"

    # Providers
    AIR_QUALITY_PROVIDER: str = "open_meteo"  # open_meteo, waqi, mock
    AIR_QUALITY_API_KEY: str = ""
    WEATHER_PROVIDER: str = "open_meteo"      # open_meteo, mock
    WEATHER_API_KEY: str = ""
    AI_PROVIDER: str = "gemini"               # gemini, mock
    AI_API_KEY: str = ""
    AI_MODEL: str = "gemini-2.5-flash"
    AI_TIMEOUT_SECONDS: float = 12.0

    # Cache TTLs in seconds
    CACHE_TTL_AIR_QUALITY_SECONDS: int = 600
    CACHE_TTL_WEATHER_SECONDS: int = 900
    CACHE_TTL_FORECAST_SECONDS: int = 1800
    CACHE_TTL_AI_SECONDS: int = 300

    # Security (runtime-generated ephemeral secret if not provided via env)
    RATE_LIMIT_PER_MINUTE: int = 60
    JWT_SECRET: str = Field(default_factory=lambda: secrets.token_urlsafe(32))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGIN.split(",") if origin.strip()]


settings = Settings()

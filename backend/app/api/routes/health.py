from fastapi import APIRouter
from backend.app.schemas.common import ApiResponse, ResponseMetadata
from backend.app.config import settings
import time

router = APIRouter(tags=["Health"])

START_TIME = time.time()

@router.get("/health", response_model=ApiResponse[dict])
async def check_health():
    uptime_seconds = int(time.time() - START_TIME)
    health_payload = {
        "status": "healthy",
        "service": "AIRWISE Climate Intelligence API",
        "version": "1.0.0-competition",
        "uptime_seconds": uptime_seconds,
        "environment": settings.ENVIRONMENT,
        "air_quality_provider": settings.AIR_QUALITY_PROVIDER,
        "ai_provider": settings.AI_PROVIDER
    }
    return ApiResponse.ok(
        data=health_payload,
        metadata=ResponseMetadata(
            source="AIRWISE Health Sentinel",
            freshness="current",
            mode="live"
        )
    )

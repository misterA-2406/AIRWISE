from fastapi import APIRouter, Query, Depends
from backend.app.schemas.common import ApiResponse, ResponseMetadata
from backend.app.schemas.daily_plan import DailyPlanResponse, PlanAdjustmentRequest
from backend.app.services.daily_plan_service import daily_plan_service
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/plan", tags=["Daily Plan"], dependencies=[Depends(check_rate_limit)])

@router.get("/today", response_model=ApiResponse[DailyPlanResponse])
async def get_today_plan(
    lat: float = Query(28.5672, description="Latitude"),
    lon: float = Query(77.2100, description="Longitude"),
    location_name: str = Query("Delhi NCR", description="Location name"),
    standard: str = Query("IN_NAAQS", description="AQI Standard")
):
    plan = await daily_plan_service.get_today_plan(lat, lon, location_name, standard)
    return ApiResponse.ok(
        data=plan,
        metadata=ResponseMetadata(
            source="AIRWISE Deterministic Itinerary Adaptation Engine",
            freshness="current",
            confidence_score=94
        )
    )

@router.post("/generate", response_model=ApiResponse[DailyPlanResponse])
async def generate_plan(request: PlanAdjustmentRequest):
    plan = await daily_plan_service.get_today_plan(adjustments=request)
    return ApiResponse.ok(data=plan)

@router.post("/regenerate", response_model=ApiResponse[DailyPlanResponse])
async def regenerate_plan(request: PlanAdjustmentRequest):
    plan = await daily_plan_service.get_today_plan(adjustments=request)
    return ApiResponse.ok(data=plan)

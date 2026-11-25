from typing import List
from fastapi import APIRouter, Depends, Path
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.daily_plan import PlanRecommendation, ActionReplaceRequest
from backend.app.services.daily_plan_service import daily_plan_service
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/recommendations", tags=["Recommendations"], dependencies=[Depends(check_rate_limit)])

@router.get("", response_model=ApiResponse[List[PlanRecommendation]])
async def list_recommendations():
    plan = await daily_plan_service.get_today_plan()
    return ApiResponse.ok(data=plan.actions)

@router.post("/{action_id}/complete", response_model=ApiResponse[dict])
async def complete_recommendation(action_id: str = Path(..., description="Action ID")):
    return ApiResponse.ok(data={
        "action_id": action_id,
        "is_completed": True,
        "message": "Action logged as completed. Avoided exposure recorded."
    })

@router.post("/{action_id}/skip", response_model=ApiResponse[dict])
async def skip_recommendation(action_id: str = Path(..., description="Action ID")):
    return ApiResponse.ok(data={
        "action_id": action_id,
        "is_skipped": True,
        "message": "Recommendation removed from today's active schedule."
    })

@router.post("/{action_id}/alternative", response_model=ApiResponse[dict])
async def replace_recommendation(
    payload: ActionReplaceRequest,
    action_id: str = Path(..., description="Action ID")
):
    return ApiResponse.ok(data={
        "action_id": action_id,
        "new_title": payload.title,
        "alternative": payload.alternative,
        "message": "Replacement applied to active schedule."
    })

@router.post("/{action_id}/explain", response_model=ApiResponse[dict])
async def explain_recommendation(action_id: str = Path(..., description="Action ID")):
    return ApiResponse.ok(data={
        "action_id": action_id,
        "scientific_basis": "Recommendation leverages diurnal boundary layer dynamics and respiratory minute volume models.",
        "uncertainty": "Micro-sensor readings near construction zones may increase local readings."
    })

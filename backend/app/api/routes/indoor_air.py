from typing import List
from fastapi import APIRouter, Depends, Query, Path
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.indoor import (
    IndoorAssessmentResponse, 
    IndoorCheckItem, 
    IndoorRecommendationItem
)
from backend.app.services.indoor_air_service import indoor_air_service
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/indoor", tags=["Indoor Air"], dependencies=[Depends(check_rate_limit)])

@router.get("/recommendations", response_model=ApiResponse[IndoorAssessmentResponse])
async def get_indoor_recommendations(
    zero_budget_only: bool = Query(False, description="Filter solely to ₹0 actions")
):
    data = indoor_air_service.get_assessment(zero_budget_only)
    return ApiResponse.ok(data=data)

@router.post("/assessment", response_model=ApiResponse[IndoorAssessmentResponse])
async def assess_indoor(zero_budget_only: bool = Query(False)):
    data = indoor_air_service.get_assessment(zero_budget_only)
    return ApiResponse.ok(data=data)

@router.post("/zero-budget", response_model=ApiResponse[IndoorAssessmentResponse])
async def filter_zero_budget():
    data = indoor_air_service.get_assessment(zero_budget_only=True)
    return ApiResponse.ok(data=data)

@router.post("/check/{check_id}/toggle", response_model=ApiResponse[List[IndoorCheckItem]])
async def toggle_check(check_id: str = Path(...)):
    updated = indoor_air_service.toggle_check(check_id)
    return ApiResponse.ok(data=updated)

@router.post("/recommendation/{rec_id}/toggle", response_model=ApiResponse[List[IndoorRecommendationItem]])
async def toggle_recommendation(rec_id: str = Path(...)):
    updated = indoor_air_service.toggle_recommendation(rec_id)
    return ApiResponse.ok(data=updated)

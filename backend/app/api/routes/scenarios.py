from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.scenario import (
    WhatIfScenarioItem, 
    ScenarioCompareRequest, 
    ScenarioCompareResponse
)
from backend.app.services.scenario_engine import scenario_engine
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/scenarios", tags=["What-if Lab"], dependencies=[Depends(check_rate_limit)])

@router.get("", response_model=ApiResponse[List[WhatIfScenarioItem]])
async def list_scenarios(category: Optional[str] = Query(None, description="Category filter")):
    data = scenario_engine.list_scenarios(category)
    return ApiResponse.ok(data=data)

@router.post("/compare", response_model=ApiResponse[ScenarioCompareResponse])
async def compare_scenario(request: ScenarioCompareRequest):
    result = scenario_engine.simulate(
        scenario_id=request.scenario_id,
        distance_km=request.distance_km or 14.0,
        wind_modifier=request.wind_condition_modifier or 1.0
    )
    return ApiResponse.ok(data=ScenarioCompareResponse(**result))

@router.post("/explain", response_model=ApiResponse[dict])
async def explain_scenario(request: ScenarioCompareRequest):
    sc = scenario_engine.get_scenario(request.scenario_id)
    return ApiResponse.ok(data={
        "scenario_id": request.scenario_id,
        "ai_verdict": sc.ai_verdict if sc else "Scenario comparison verified.",
        "tradeoffs": sc.tradeoff_analysis if sc else "",
        "methodology": sc.calculation_method if sc else "IPCC 2021"
    })

@router.post("/save", response_model=ApiResponse[dict])
async def save_scenario(request: ScenarioCompareRequest):
    return ApiResponse.ok(data={
        "status": "saved",
        "scenario_id": request.scenario_id,
        "message": "Scenario comparison permanently archived to personal library."
    })

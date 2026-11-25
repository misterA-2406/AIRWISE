from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ScenarioOptionDetail(BaseModel):
    name: str
    details: str
    exposure_score: int       # 0 - 100 relative index
    emissions_kg_co2: float   # 0.0 if zero tailpipe
    time_minutes: int
    cost_inr: float
    health_tradeoff: str

class WhatIfScenarioItem(BaseModel):
    id: str
    title: str
    category: str             # Commute, Exercise, Ventilation, Route, Cooking, Purification
    description: str
    option_a: ScenarioOptionDetail
    option_b: ScenarioOptionDetail
    ai_verdict: str
    tradeoff_analysis: str
    exposure_reduction_percent: int
    emissions_delta_kg: float
    calculation_method: Optional[str] = "IPCC 2021 Urban Mobility Benchmarks & Diurnal Dispersion"
    uncertainties: List[str] = []
    assumptions: List[str] = []

class ScenarioCompareRequest(BaseModel):
    scenario_id: str
    distance_km: Optional[float] = 14.0
    wind_condition_modifier: Optional[float] = 1.0  # 0.5 (inversion trap) to 1.8 (turbulent mixing)

class ScenarioCompareResponse(BaseModel):
    scenario: WhatIfScenarioItem
    adjusted_reduction_percent: int
    adjusted_emissions_delta_kg: float
    qualitative_summary: str

from typing import Optional, List, Dict
from pydantic import BaseModel, Field

class BenefitDetail(BaseModel):
    type: str = "potential_exposure_reduction"
    description: str

class PlanRecommendation(BaseModel):
    id: str
    period: str  # before-leaving, commute-morning, work-study, lunch, outdoor-activities, returning-home, evening, sleep
    time_label: str
    title: str
    action: str
    why_today: str
    personal_relevance: str
    cost: str = "₹0 Free"
    cost_numeric: float = 0.0
    effort: str = "Low"  # Low, Medium, High
    alternative: str
    impact: str
    benefit: Optional[BenefitDetail] = None
    category: str        # Commute, Indoor Air, Health, Schedule, Routine
    is_completed: bool = False
    is_saved: bool = False
    is_skipped: bool = False
    confidence_reason: Optional[str] = None
    confidence: str = "high"
    data_sources: List[str] = []

class DailyPlanResponse(BaseModel):
    date: str
    location_name: str
    aqi: int
    risk_level: str
    total_actions: int
    completed_actions: int
    exposure_reduction_estimate: str
    priority_decision: PlanRecommendation
    actions: List[PlanRecommendation]

class PlanAdjustmentRequest(BaseModel):
    is_wfh_today: bool = False
    exercise_timing_override: Optional[str] = None  # indoor, early, skip
    zero_budget_only: bool = False
    commute_mode_override: Optional[str] = None

class ActionReplaceRequest(BaseModel):
    title: str
    alternative: str

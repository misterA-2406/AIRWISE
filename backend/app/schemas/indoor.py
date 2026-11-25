from typing import Optional, List
from pydantic import BaseModel

class IndoorCheckItem(BaseModel):
    id: str
    source: str
    detected_or_reported: bool
    impact_level: str  # low, moderate, high, severe
    typical_pollutant: str
    free_mitigation: str
    paid_mitigation: Optional[str] = None

class IndoorRecommendationItem(BaseModel):
    id: str
    timeframe: str  # Immediate, Today, This Week, Long-term
    title: str
    cost: str
    cost_numeric: float
    effort: str
    reason: str
    expected_usefulness: str
    limitations: str
    is_zero_budget_eligible: bool
    is_implemented: bool

class IndoorAssessmentResponse(BaseModel):
    zero_budget_active: bool
    sources_audited: List[IndoorCheckItem]
    recommendations: List[IndoorRecommendationItem]
    home_priorities: List[str]

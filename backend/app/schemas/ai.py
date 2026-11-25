from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ActionableAICard(BaseModel):
    title: str
    category: str
    action_text: str
    reduction_impact: str

class AIContextPayload(BaseModel):
    location: str
    aqi: int
    primary_pollutant: str
    standard: str = "IN_NAAQS"
    weather_condition: str
    commute_mode: Optional[str] = "Metro"
    has_vulnerable_members: bool = True
    budget_mode: str = "zero-budget"
    rule_generated_actions: List[str] = []

class AIQueryRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, description="User question for AIRWISE Copilot")
    context: Optional[AIContextPayload] = None

class AIStructuredResponse(BaseModel):
    summary: str
    risk_context: str
    priority_actions: List[str] = Field(default_factory=list)
    alternatives: List[str] = Field(default_factory=list)
    tradeoffs: List[str] = Field(default_factory=list)
    explanation: str
    uncertainties: List[str] = Field(default_factory=list)
    sources: List[str] = Field(default_factory=list)
    actionable_card: Optional[ActionableAICard] = None
    confidence_score: int = 94
    medical_disclaimer: str = (
        "Environmental adaptation guidance does not substitute for clinical consultation "
        "or physician directives for pre-existing respiratory or cardiovascular conditions."
    )

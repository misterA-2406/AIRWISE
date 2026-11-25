from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from backend.app.schemas.daily_plan import DailyPlanResponse, PlanRecommendation, PlanAdjustmentRequest
from backend.app.services.air_quality_service import air_quality_service
from backend.app.services.recommendation_engine import recommendation_engine

class DailyPlanService:
    def __init__(self):
        self._custom_actions_store: Dict[str, List[PlanRecommendation]] = {}

    async def get_today_plan(
        self,
        lat: float = 28.5672,
        lon: float = 77.2100,
        location_name: str = "Delhi NCR",
        standard: str = "IN_NAAQS",
        profile: Optional[Dict[str, Any]] = None,
        routine: Optional[Dict[str, Any]] = None,
        adjustments: Optional[PlanAdjustmentRequest] = None
    ) -> DailyPlanResponse:
        air = await air_quality_service.get_current_air(lat, lon, location_name, standard)
        
        prof = profile or {
            "has_children": True,
            "has_elderly": True,
            "has_respiratory_sensitivity": True,
            "budget_preference": "zero-budget"
        }
        
        rout = routine or {
            "primary_transport": adjustments.commute_mode_override if (adjustments and adjustments.commute_mode_override) else "Metro",
            "commute_minutes": 38,
            "exercise_type": "Running",
            "exercise_time": "Evening"
        }

        is_wfh = adjustments.is_wfh_today if adjustments else False
        zero_budget = adjustments.zero_budget_only if adjustments else False

        actions = recommendation_engine.generate_plan(
            air=air,
            profile=prof,
            routine=rout,
            is_wfh_today=is_wfh,
            zero_budget_only=zero_budget
        )

        completed_count = sum(1 for a in actions if a.is_completed)
        total_count = len(actions)

        # Primary priority decision is the 5th action (exercise shift) or 1st action
        priority_dec = actions[4] if len(actions) > 4 else actions[0]

        return DailyPlanResponse(
            date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            location_name=air.location_name,
            aqi=air.aqi,
            risk_level=air.risk_level,
            total_actions=total_count,
            completed_actions=completed_count,
            exposure_reduction_estimate="-58% vs unmitigated day",
            priority_decision=priority_dec,
            actions=actions
        )

daily_plan_service = DailyPlanService()

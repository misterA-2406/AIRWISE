from fastapi import APIRouter, Depends
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.profile import UserRoutineSchema
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/routine", tags=["Routine"], dependencies=[Depends(check_rate_limit)])

_current_routine = {
    "home_location": "South Extension, Delhi",
    "work_location": "Cyber Hub / Connaught Place",
    "primary_transport": "Metro",
    "commute_minutes": 38,
    "exercise_time": "Evening",
    "exercise_type": "Running",
    "commute_flexible": True,
    "exercise_flexible": True,
    "activities": [
        {"id": "act-r1", "time": "06:30 - 07:15", "name": "Morning wake-up & tea", "type": "indoor", "location": "Home Kitchen", "is_flexible": False, "exposure_risk": "moderate"},
        {"id": "act-r2", "time": "08:30 - 09:15", "name": "Commute to Office", "type": "commute", "location": "Metro Yellow Line", "transport": "Metro", "is_flexible": True, "exposure_risk": "high"},
        {"id": "act-r3", "time": "09:30 - 13:00", "name": "Work at Desk", "type": "work", "location": "Office Tower (HEPA HVAC)", "is_flexible": False, "exposure_risk": "low"},
        {"id": "act-r4", "time": "13:00 - 13:45", "name": "Lunch & Steps", "type": "meal", "location": "Office Garden Walkway", "is_flexible": True, "exposure_risk": "moderate"},
        {"id": "act-r5", "time": "14:00 - 18:00", "name": "Focus Work & Calls", "type": "work", "location": "Office Floor 4", "is_flexible": False, "exposure_risk": "low"},
        {"id": "act-r6", "time": "18:15 - 19:00", "name": "Return Commute", "type": "commute", "location": "Metro + Last Mile Auto", "transport": "Metro", "is_flexible": True, "exposure_risk": "high"},
        {"id": "act-r7", "time": "19:30 - 20:15", "name": "Cardio / Workout", "type": "exercise", "location": "Local Park (Flagged)", "is_flexible": True, "exposure_risk": "severe"},
        {"id": "act-r8", "time": "20:30 - 22:30", "name": "Dinner & Family time", "type": "indoor", "location": "Living Room", "is_flexible": False, "exposure_risk": "low"}
    ]
}

@router.get("", response_model=ApiResponse[UserRoutineSchema])
async def get_routine():
    return ApiResponse.ok(data=UserRoutineSchema(**_current_routine))

@router.post("", response_model=ApiResponse[UserRoutineSchema])
async def save_routine(payload: UserRoutineSchema):
    global _current_routine
    _current_routine = payload.model_dump()
    return ApiResponse.ok(data=UserRoutineSchema(**_current_routine))

@router.patch("", response_model=ApiResponse[UserRoutineSchema])
async def update_routine(payload: UserRoutineSchema):
    global _current_routine
    _current_routine.update({k: v for k, v in payload.model_dump().items() if v is not None})
    return ApiResponse.ok(data=UserRoutineSchema(**_current_routine))

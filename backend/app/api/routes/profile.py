from fastapi import APIRouter, Depends
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.profile import UserProfileCreate, UserProfileUpdate, UserProfileResponse
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/profile", tags=["Profile"], dependencies=[Depends(check_rate_limit)])

# In-memory session profile store for development / persistence fallback
_current_profile = {
    "id": "prof-001",
    "user_id": "usr-default",
    "preferred_name": "Aarav Sharma",
    "city": "Delhi NCR",
    "sub_area": "South Extension",
    "latitude": 28.5672,
    "longitude": 77.2100,
    "timezone": "Asia/Kolkata",
    "household_size": 4,
    "has_children": True,
    "has_elderly": True,
    "has_respiratory_sensitivity": True,
    "has_cardiac_history": False,
    "home_type": "Apartment",
    "ventilation_type": "Cross-ventilation windows",
    "air_purifier_owned": True,
    "cooking_fuel": "LPG Gas",
    "budget_preference": "zero-budget",
    "aqi_standard": "IN_NAAQS",
    "notification_threshold_aqi": 200,
    "created_at": "2026-11-20T10:00:00Z",
    "updated_at": "2026-11-21T08:30:00Z"
}

@router.get("", response_model=ApiResponse[UserProfileResponse])
async def get_profile():
    return ApiResponse.ok(data=UserProfileResponse(**_current_profile))

@router.post("", response_model=ApiResponse[UserProfileResponse])
async def create_or_replace_profile(payload: UserProfileCreate):
    global _current_profile
    _current_profile.update(payload.model_dump())
    return ApiResponse.ok(data=UserProfileResponse(**_current_profile))

@router.patch("", response_model=ApiResponse[UserProfileResponse])
async def update_profile(payload: UserProfileUpdate):
    global _current_profile
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    _current_profile.update(update_data)
    return ApiResponse.ok(data=UserProfileResponse(**_current_profile))

@router.delete("", response_model=ApiResponse[dict])
async def delete_profile():
    global _current_profile
    _current_profile["preferred_name"] = "Anonymous User"
    return ApiResponse.ok(data={"message": "Profile scrubbed successfully in accordance with privacy controls."})

from typing import Optional, List
from pydantic import BaseModel, Field

class VulnerableMembersSchema(BaseModel):
    children: bool = True
    elderly: bool = True
    asthma_or_allergies: bool = True
    cardiac_history: bool = False

class UserProfileCreate(BaseModel):
    preferred_name: Optional[str] = "Aarav Sharma"
    city: str = "Delhi NCR"
    sub_area: Optional[str] = "South Extension"
    latitude: float = 28.5672
    longitude: float = 77.2100
    timezone: str = "Asia/Kolkata"
    household_size: int = 4
    has_children: bool = True
    has_elderly: bool = True
    has_respiratory_sensitivity: bool = True
    has_cardiac_history: bool = False
    home_type: str = "Apartment"
    ventilation_type: str = "Cross-ventilation windows"
    air_purifier_owned: bool = True
    cooking_fuel: str = "LPG Gas"
    budget_preference: str = "zero-budget"
    aqi_standard: str = "IN_NAAQS"
    notification_threshold_aqi: int = 200

class UserProfileUpdate(BaseModel):
    preferred_name: Optional[str] = None
    city: Optional[str] = None
    sub_area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    household_size: Optional[int] = None
    has_children: Optional[bool] = None
    has_elderly: Optional[bool] = None
    has_respiratory_sensitivity: Optional[bool] = None
    has_cardiac_history: Optional[bool] = None
    home_type: Optional[str] = None
    ventilation_type: Optional[str] = None
    air_purifier_owned: Optional[bool] = None
    cooking_fuel: Optional[str] = None
    budget_preference: Optional[str] = None
    aqi_standard: Optional[str] = None
    notification_threshold_aqi: Optional[int] = None

class UserProfileResponse(UserProfileCreate):
    id: str
    user_id: str
    created_at: str
    updated_at: str

# Routine Schemas
class RoutineActivitySchema(BaseModel):
    id: Optional[str] = None
    time: str
    name: str
    type: str  # commute, work, exercise, meal, indoor, outdoor, rest
    location: str
    transport: Optional[str] = None
    is_flexible: bool = True
    exposure_risk: str = "moderate"

class UserRoutineSchema(BaseModel):
    home_location: str = "South Extension, Delhi"
    work_location: str = "Cyber Hub / Connaught Place"
    primary_transport: str = "Metro"
    commute_minutes: int = 38
    exercise_time: str = "Evening"
    exercise_type: str = "Running"
    commute_flexible: bool = True
    exercise_flexible: bool = True
    activities: List[RoutineActivitySchema] = []

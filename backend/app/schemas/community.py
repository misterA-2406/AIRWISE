from typing import Optional, List
from pydantic import BaseModel

class CommunityChallengeSchema(BaseModel):
    id: str
    title: str
    description: str
    scope: str
    total_goal: int
    current_progress: int
    unit: str
    participants_count: int
    days_remaining: int
    joined: bool
    completed_by_me: bool
    estimated_emissions_avoided_kg: float
    methodology_note: str

class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    actions: int
    streak: str
    scope: str

class CommunityOverviewResponse(BaseModel):
    total_verified_actions: int
    total_estimated_avoided_emissions_kg: float
    active_participants_count: int
    challenges: List[CommunityChallengeSchema]
    leaderboard: List[LeaderboardEntry]

class ActionLogRequest(BaseModel):
    challenge_id: Optional[str] = None
    action_type: str
    details: Optional[str] = None
    distance_km: Optional[float] = None

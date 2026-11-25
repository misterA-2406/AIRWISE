from fastapi import APIRouter, Depends, Path
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.community import CommunityOverviewResponse, ActionLogRequest
from backend.app.services.community_service import community_service
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/community", tags=["Community"], dependencies=[Depends(check_rate_limit)])

@router.get("", response_model=ApiResponse[CommunityOverviewResponse])
async def get_community_overview():
    data = community_service.get_overview()
    return ApiResponse.ok(data=data)

@router.get("/challenges", response_model=ApiResponse[list])
async def list_challenges():
    overview = community_service.get_overview()
    return ApiResponse.ok(data=overview.challenges)

@router.post("/challenges/{challenge_id}/join", response_model=ApiResponse[dict])
async def join_challenge(challenge_id: str = Path(...)):
    updated = community_service.toggle_join(challenge_id)
    return ApiResponse.ok(data={"status": "updated", "challenge": updated})

@router.post("/actions", response_model=ApiResponse[dict])
async def log_community_action(request: ActionLogRequest):
    updated = community_service.log_action(request.challenge_id or "com-1")
    return ApiResponse.ok(data={"status": "logged", "challenge": updated})

@router.get("/leaderboard", response_model=ApiResponse[list])
async def get_leaderboard():
    overview = community_service.get_overview()
    return ApiResponse.ok(data=overview.leaderboard)

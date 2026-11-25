from typing import List
from fastapi import APIRouter, Depends, Path
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.notification import NotificationItem, NotificationPreferenceUpdate
from backend.app.services.notification_service import notification_service
from backend.app.core.rate_limit import check_rate_limit

router = APIRouter(prefix="/notifications", tags=["Notifications"], dependencies=[Depends(check_rate_limit)])

@router.get("", response_model=ApiResponse[List[NotificationItem]])
async def list_notifications():
    data = notification_service.list_notifications()
    return ApiResponse.ok(data=data)

@router.post("/{notif_id}/read", response_model=ApiResponse[List[NotificationItem]])
async def mark_read(notif_id: str = Path(...)):
    data = notification_service.mark_read(notif_id)
    return ApiResponse.ok(data=data)

@router.post("/read-all", response_model=ApiResponse[List[NotificationItem]])
async def mark_all_read():
    data = notification_service.mark_all_read()
    return ApiResponse.ok(data=data)

@router.patch("/preferences", response_model=ApiResponse[dict])
async def update_preferences(payload: NotificationPreferenceUpdate):
    return ApiResponse.ok(data={
        "status": "updated",
        "threshold_aqi": payload.threshold_aqi,
        "message": "Notification dispatch rules updated."
    })

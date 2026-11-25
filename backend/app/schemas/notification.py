from typing import Optional, List
from pydantic import BaseModel

class NotificationItem(BaseModel):
    id: str
    type: str  # peak_alert, ventilation, plan_ready, community, tip
    title: str
    message: str
    severity: str  # info, warning, alert
    is_read: bool
    created_at: str

class NotificationPreferenceUpdate(BaseModel):
    threshold_aqi: int
    alert_ventilation: bool
    alert_commute: bool

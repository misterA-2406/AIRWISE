from typing import List, Dict, Any
from datetime import datetime
from backend.app.schemas.notification import NotificationItem

NOTIFICATIONS_SEED = [
    NotificationItem(
        id="notif-1",
        type="peak_alert",
        title="Severe Inversion Alert Active",
        message="Surface wind dropped to 2.4 km/h. Ambient PM2.5 reached 284 µg/m³. Shift outdoor cardio indoors.",
        severity="alert",
        is_read=False,
        created_at="15m ago"
    ),
    NotificationItem(
        id="notif-2",
        type="ventilation",
        title="Solar Aeration Window Approaching (1:30 PM)",
        message="Atmospheric boundary layer is lifting. Ideal 20-minute window for cross-ventilation to flush indoor CO2.",
        severity="info",
        is_read=False,
        created_at="1h ago"
    ),
    NotificationItem(
        id="notif-3",
        type="plan_ready",
        title="Your Daily Air Plan is Optimized",
        message="Based on your 08:30 commute and evening run, 8 personalized decisions are generated for today.",
        severity="info",
        is_read=True,
        created_at="2h ago"
    ),
    NotificationItem(
        id="notif-4",
        type="community",
        title="Community Milestone: 700+ Peak Trips Shifted!",
        message="Your neighborhood group reached 74% of monthly goal, avoiding ~618 kg CO2 and roadside particulate.",
        severity="info",
        is_read=True,
        created_at="5h ago"
    )
]

class NotificationService:
    def __init__(self):
        self.notifications = {n.id: n for n in NOTIFICATIONS_SEED}

    def list_notifications(self) -> List[NotificationItem]:
        return list(self.notifications.values())

    def mark_read(self, notif_id: str) -> List[NotificationItem]:
        if notif_id in self.notifications:
            self.notifications[notif_id] = self.notifications[notif_id].model_copy(update={"is_read": True})
        return list(self.notifications.values())

    def mark_all_read(self) -> List[NotificationItem]:
        for k in self.notifications:
            self.notifications[k] = self.notifications[k].model_copy(update={"is_read": True})
        return list(self.notifications.values())

notification_service = NotificationService()

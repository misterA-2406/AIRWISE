from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from backend.app.db.database import Base

class PlanRecommendationModel(Base):
    __tablename__ = "plan_recommendations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    date = Column(String, index=True, nullable=False)  # YYYY-MM-DD
    
    period = Column(String, nullable=False)            # before-leaving, commute-morning, etc.
    time_label = Column(String, nullable=False)
    title = Column(String, nullable=False)
    why_today = Column(Text, nullable=False)
    personal_relevance = Column(Text, nullable=False)
    cost = Column(String, default="₹0 Free")
    cost_numeric = Column(Float, default=0.0)
    effort = Column(String, default="Low")             # Low, Medium, High
    alternative = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)
    category = Column(String, nullable=False)          # Commute, Indoor Air, Health, Schedule, Routine
    
    is_completed = Column(Boolean, default=False)
    is_saved = Column(Boolean, default=False)
    is_skipped = Column(Boolean, default=False)
    confidence_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

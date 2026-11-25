from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.database import Base

class CompletedAction(Base):
    __tablename__ = "completed_actions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    recommendation_id = Column(String, nullable=True)
    
    category = Column(String, nullable=False)         # Commute, Indoor Air, Health, Community
    action_title = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    
    # Impact Categorization: strict separation between verified and estimated
    is_verified = Column(Boolean, default=True)       # Action confirmed by user
    distance_km = Column(Float, nullable=True)
    estimated_emissions_avoided_kg = Column(Float, default=0.0)
    calculation_method = Column(Text, nullable=True)  # IPCC 2021 Urban Rail vs Two-wheeler factor
    assumptions_documented = Column(Text, nullable=True)
    
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="completed_actions")

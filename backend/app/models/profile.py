import json
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Geographic Context
    city = Column(String, default="Delhi NCR")
    sub_area = Column(String, default="South Extension")
    latitude = Column(Float, default=28.5672)
    longitude = Column(Float, default=77.2100)
    timezone = Column(String, default="Asia/Kolkata")
    
    # Household & Vulnerability Context (Optional & Privacy-first)
    household_size = Column(Integer, default=4)
    has_children = Column(Boolean, default=True)
    has_elderly = Column(Boolean, default=True)
    has_respiratory_sensitivity = Column(Boolean, default=True)
    has_cardiac_history = Column(Boolean, default=False)
    
    # Environmental & Home Attributes
    home_type = Column(String, default="Apartment")
    ventilation_type = Column(String, default="Cross-ventilation windows")
    air_purifier_owned = Column(Boolean, default=True)
    cooking_fuel = Column(String, default="LPG Gas")
    
    # Constraints & Preferences
    budget_preference = Column(String, default="zero-budget")  # zero-budget, practical, unrestricted
    aqi_standard = Column(String, default="IN_NAAQS")          # IN_NAAQS, US_AQI, WHO_2021
    notification_threshold_aqi = Column(Integer, default=200)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.database import Base

class UserRoutine(Base):
    __tablename__ = "user_routines"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Commute parameters
    home_location = Column(String, default="South Extension, Delhi")
    work_location = Column(String, default="Cyber Hub / Connaught Place")
    primary_transport = Column(String, default="Metro")  # Metro, Bus, Cycling, Walking, Car, Motorbike
    commute_minutes = Column(Integer, default=38)
    
    # Exercise & Daily Schedule
    exercise_timing = Column(String, default="Evening")   # Early Morning, Midday, Evening, Indoor Only
    exercise_type = Column(String, default="Running")     # Running, Gym, Yoga, Cycling, Walking
    
    # Flexible Schedule Indicators
    commute_flexible = Column(Boolean, default=True)
    exercise_flexible = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="routine")
    activities = relationship("RoutineActivityModel", back_populates="routine", cascade="all, delete-orphan")

class RoutineActivityModel(Base):
    __tablename__ = "routine_activities"

    id = Column(String, primary_key=True, index=True)
    routine_id = Column(String, ForeignKey("user_routines.id"), nullable=False)
    
    time_window = Column(String, nullable=False)  # e.g. "08:30 - 09:15"
    name = Column(String, nullable=False)
    activity_type = Column(String, default="indoor")  # indoor, outdoor, commute, exercise, meal, work
    location = Column(String, default="Home")
    transport = Column(String, nullable=True)
    is_flexible = Column(Boolean, default=True)
    exposure_risk_tier = Column(String, default="moderate")

    routine = relationship("UserRoutine", back_populates="activities")

from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey
from backend.app.db.database import Base

class SavedScenarioComparison(Base):
    __tablename__ = "saved_scenarios"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    scenario_id = Column(String, nullable=False)
    
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    chosen_option = Column(String, nullable=False)     # "Option A" or "Option B"
    exposure_reduction_percent = Column(Integer, default=0)
    emissions_delta_kg = Column(Float, default=0.0)
    user_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

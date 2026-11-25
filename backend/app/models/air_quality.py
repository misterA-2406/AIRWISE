from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text
from backend.app.db.database import Base

class AirQualityRecord(Base):
    __tablename__ = "air_quality_records"

    id = Column(String, primary_key=True, index=True)
    provider = Column(String, nullable=False, index=True)
    location_name = Column(String, nullable=False, index=True)
    sub_area = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # AQI & Classification
    aqi = Column(Integer, nullable=False)
    standard = Column(String, nullable=False, default="IN_NAAQS")
    risk_level = Column(String, nullable=False)  # low, moderate, high, severe
    primary_pollutant = Column(String, nullable=False)  # pm25, pm10, o3, no2, co, so2
    
    # Concentrations in µg/m³ or ppb
    pm25 = Column(Float, nullable=True)
    pm10 = Column(Float, nullable=True)
    o3 = Column(Float, nullable=True)
    no2 = Column(Float, nullable=True)
    co = Column(Float, nullable=True)
    so2 = Column(Float, nullable=True)
    
    # Weather context
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_direction = Column(String, nullable=True)
    condition = Column(String, nullable=True)
    
    # Meta
    data_type = Column(String, default="observation")  # observation, forecast, modeled
    confidence_score = Column(Integer, default=90)
    active_sensors = Column(Integer, default=1)
    is_stale = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

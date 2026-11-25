from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, ForeignKey
from backend.app.db.database import Base

class CommunityGroup(Base):
    __tablename__ = "community_groups"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    scope = Column(String, default="Neighborhood")  # Apartment, Neighborhood, Campus, Family
    created_at = Column(DateTime, default=datetime.utcnow)

class CommunityChallenge(Base):
    __tablename__ = "community_challenges"

    id = Column(String, primary_key=True, index=True)
    group_id = Column(String, ForeignKey("community_groups.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    scope = Column(String, default="Neighborhood")
    
    total_goal = Column(Integer, default=100)
    current_progress = Column(Integer, default=0)
    unit = Column(String, default="actions")
    days_remaining = Column(Integer, default=7)
    
    estimated_emissions_avoided_kg = Column(Float, default=0.0)
    methodology_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChallengeParticipant(Base):
    __tablename__ = "challenge_participants"

    id = Column(String, primary_key=True, index=True)
    challenge_id = Column(String, ForeignKey("community_challenges.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    actions_contributed = Column(Integer, default=0)
    joined_at = Column(DateTime, default=datetime.utcnow)

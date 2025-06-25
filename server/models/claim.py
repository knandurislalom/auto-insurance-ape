"""
Claim model for the Auto Insurance system.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class Claim(Base):
    """
    SQLAlchemy model for insurance claims.
    
    Represents a single insurance claim with all associated information
    including policy details, vehicle information, incident details, and status.
    """
    
    __tablename__ = "claims"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Policy and claimant information
    policy_number = Column(String(50), nullable=False, index=True)
    claimant_name = Column(String(100), nullable=False)
    
    # Vehicle information
    vehicle_make = Column(String(50))
    vehicle_model = Column(String(50))
    vehicle_year = Column(Integer)
    vehicle_vin = Column(String)
    
    # Driver information
    driver_present = Column(Boolean, default=True)
    driver_name = Column(String(100))
    driver_license = Column(String(50))
    
    # Incident information
    incident_date = Column(String(10))  # YYYY-MM-DD format
    incident_time = Column(String(8))   # HH:MM:SS format
    incident_location = Column(Text)
    weather_conditions = Column(String(50))
    
    # Damage and injury information
    damage_description = Column(Text)
    estimated_damage = Column(Integer, nullable=False)
    injuries_reported = Column(Boolean, default=False)
    
    # Status and timestamps
    submission_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default='pending', index=True)
    
    # Relationships
    documents = relationship("Document", back_populates="claim", cascade="all, delete-orphan")
    inconsistencies = relationship("Inconsistency", back_populates="claim", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Claim(id={self.id}, policy_number='{self.policy_number}', claimant='{self.claimant_name}', status='{self.status}')>"
    
    def to_dict(self):
        """Convert claim to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'policy_number': self.policy_number,
            'claimant_name': self.claimant_name,
            'vehicle_make': self.vehicle_make,
            'vehicle_model': self.vehicle_model,
            'vehicle_year': self.vehicle_year,
            'vehicle_vin': self.vehicle_vin,
            'driver_present': self.driver_present,
            'driver_name': self.driver_name,
            'driver_license': self.driver_license,
            'incident_date': self.incident_date,
            'incident_time': self.incident_time,
            'incident_location': self.incident_location,
            'weather_conditions': self.weather_conditions,
            'damage_description': self.damage_description,
            'estimated_damage': self.estimated_damage,
            'injuries_reported': self.injuries_reported,
            'submission_date': self.submission_date.isoformat() if self.submission_date else None,
            'status': self.status
        }
    
    @property
    def full_vehicle_info(self):
        """Get formatted vehicle information."""
        parts = [str(self.vehicle_year) if self.vehicle_year else "",
                self.vehicle_make or "",
                self.vehicle_model or ""]
        return " ".join(part for part in parts if part).strip()
    
    @property
    def is_recent(self):
        """Check if claim was submitted in the last 30 days."""
        if not self.submission_date:
            return False
        from datetime import datetime, timedelta
        return self.submission_date > datetime.now() - timedelta(days=30)

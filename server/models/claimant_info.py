"""
ClaimantInfo model for the Auto Insurance system.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class ClaimantInfo(Base):
    """
    SQLAlchemy model for claimant contact information.
    
    Represents contact details for insurance claimants,
    including email address and phone number.
    """
    
    __tablename__ = "claimant_info"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Contact information
    email_address = Column(String(255), nullable=True, index=True)
    phone_number = Column(String(20), nullable=True)
    
    # Additional contact fields (optional)
    alternative_email = Column(String(255), nullable=True)
    alternative_phone = Column(String(20), nullable=True)
    preferred_contact_method = Column(String(50), nullable=True)  # email, phone, text
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<ClaimantInfo(id={self.id}, email='{self.email_address}', phone='{self.phone_number}')>"
    
    def to_dict(self):
        """Convert the ClaimantInfo instance to a dictionary."""
        return {
            "id": self.id,
            "email_address": self.email_address,
            "phone_number": self.phone_number,
            "alternative_email": self.alternative_email,
            "alternative_phone": self.alternative_phone,
            "preferred_contact_method": self.preferred_contact_method,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

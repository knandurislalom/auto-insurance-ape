"""
Inconsistency model for the Auto Insurance system.
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Inconsistency(Base):
    """
    SQLAlchemy model for claim inconsistencies.
    
    Represents discrepancies between form data and extracted document data,
    helping to identify potential issues or errors in claim processing.
    """
    
    __tablename__ = "inconsistencies"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign key to claims table
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False, index=True)
    
    # Inconsistency details
    field_name = Column(String(100), nullable=False)     # Name of the field with inconsistency
    form_value = Column(String(500))                     # Value from the form
    extracted_value = Column(String(500))               # Value extracted from document
    confidence_score = Column(Float)                    # Confidence score (0.0 to 1.0)
    
    # Relationships
    claim = relationship("Claim", back_populates="inconsistencies")
    
    def __repr__(self):
        return f"<Inconsistency(id={self.id}, field='{self.field_name}', claim_id={self.claim_id}, confidence={self.confidence_score})>"
    
    def to_dict(self):
        """Convert inconsistency to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'claim_id': self.claim_id,
            'field_name': self.field_name,
            'form_value': self.form_value,
            'extracted_value': self.extracted_value,
            'confidence_score': self.confidence_score,
            'severity': self.severity,
            'is_significant': self.is_significant
        }
    
    @property
    def severity(self):
        """
        Determine the severity of the inconsistency based on confidence score.
        Returns: 'low', 'medium', 'high'
        """
        if self.confidence_score is None:
            return 'unknown'
        elif self.confidence_score >= 0.9:
            return 'high'
        elif self.confidence_score >= 0.7:
            return 'medium'
        else:
            return 'low'
    
    @property
    def is_significant(self):
        """
        Check if this inconsistency is significant enough to require attention.
        Returns True for medium and high severity inconsistencies.
        """
        return self.severity in ['medium', 'high']
    
    @property
    def has_values(self):
        """Check if both form and extracted values exist."""
        return bool(self.form_value and self.extracted_value)
    
    def get_difference_type(self):
        """
        Analyze the type of difference between form and extracted values.
        Returns: 'exact_match', 'case_difference', 'format_difference', 'content_difference'
        """
        if not self.has_values:
            return 'missing_data'
        
        if self.form_value == self.extracted_value:
            return 'exact_match'
        elif self.form_value.lower() == self.extracted_value.lower():
            return 'case_difference'
        elif self.form_value.replace(' ', '').replace('-', '') == self.extracted_value.replace(' ', '').replace('-', ''):
            return 'format_difference'
        else:
            return 'content_difference'

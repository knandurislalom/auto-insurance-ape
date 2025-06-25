"""
Document model for the Auto Insurance system.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import json


class Document(Base):
    """
    SQLAlchemy model for claim documents.
    
    Represents uploaded documents associated with insurance claims,
    including photos, forms, and other supporting documentation.
    """
    
    __tablename__ = "documents"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign key to claims table
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False, index=True)
    
    # File information
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(100))  # MIME type
    file_size = Column(Integer)      # Size in bytes
    
    # Upload and processing information
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    _extracted_data = Column('extracted_data', Text)    # JSON string of OCR/AI extracted data
    
    @property
    def extracted_data(self):
        """Get extracted data as a Python object (parsed JSON)."""
        if self._extracted_data:
            try:
                return json.loads(self._extracted_data)
            except json.JSONDecodeError:
                return None
        return None
    
    @extracted_data.setter
    def extracted_data(self, value):
        """Set extracted data from a Python object (will be stored as JSON)."""
        if value is not None:
            self._extracted_data = json.dumps(value)
        else:
            self._extracted_data = None
    
    # Relationships
    claim = relationship("Claim", back_populates="documents")
    
    def __repr__(self):
        return f"<Document(id={self.id}, filename='{self.filename}', claim_id={self.claim_id})>"
    
    def to_dict(self):
        """Convert document to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'claim_id': self.claim_id,
            'filename': self.filename,
            'file_path': self.file_path,
            'file_type': self.file_type,
            'file_size': self.file_size,
            'upload_date': self.upload_date.isoformat() if self.upload_date else None,
            'extracted_data': self.extracted_data
        }
    
    def get_extracted_data(self):
        """Get extracted data as a Python object (parsed JSON)."""
        return self.extracted_data
    
    def set_extracted_data(self, data):
        """Set extracted data from a Python object (will be stored as JSON)."""
        self.extracted_data = data
    
    @property
    def file_size_mb(self):
        """Get file size in megabytes."""
        if self.file_size:
            return round(self.file_size / (1024 * 1024), 2)
        return 0
    
    @property
    def is_image(self):
        """Check if the document is an image file."""
        if self.file_type:
            return self.file_type.startswith('image/')
        return False
    
    @property
    def is_pdf(self):
        """Check if the document is a PDF file."""
        return self.file_type == 'application/pdf'

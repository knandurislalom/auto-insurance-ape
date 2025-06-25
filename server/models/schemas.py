"""
Pydantic schemas for request/response validation.

These schemas define the structure of data for API requests and responses,
providing validation and serialization for the Auto Insurance system.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
import re

from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
import re


class ClaimBase(BaseModel):
    """Base schema for claim data."""
    policy_number: str = Field(..., min_length=1, max_length=50, description="Insurance policy number")
    claimant_name: str = Field(..., min_length=1, max_length=100, description="Name of the claimant")
    vehicle_make: Optional[str] = Field(None, max_length=50, description="Vehicle manufacturer")
    vehicle_model: Optional[str] = Field(None, max_length=50, description="Vehicle model")
    vehicle_year: Optional[int] = Field(None, ge=1900, le=2030, description="Vehicle year")
    vehicle_vin: Optional[str] = Field(None, description="Vehicle VIN")
    driver_present: Optional[bool] = Field(True, description="Was the driver present during incident")
    driver_name: Optional[str] = Field(None, max_length=100, description="Driver name")
    driver_license: Optional[str] = Field(None, max_length=50, description="Driver license number")
    incident_date: Optional[str] = Field(None, description="Date of incident (YYYY-MM-DD)")
    incident_time: Optional[str] = Field(None, description="Time of incident (HH:MM:SS)")
    incident_location: Optional[str] = Field(None, description="Location where incident occurred")
    weather_conditions: Optional[str] = Field(None, max_length=50, description="Weather conditions")
    damage_description: Optional[str] = Field(None, description="Description of damage")
    estimated_damage: int = Field(..., ge=0, description="Estimated damage amount in dollars")
    injuries_reported: Optional[bool] = Field(False, description="Were there any injuries reported")
    status: Optional[str] = Field("pending", max_length=20, description="Claim status")

    @validator('incident_date')
    def validate_incident_date(cls, v):
        if v and not re.match(r'^\d{4}-\d{2}-\d{2}$', v):
            raise ValueError('Date must be in YYYY-MM-DD format')
        return v

    @validator('incident_time')
    def validate_incident_time(cls, v):
        if v and not re.match(r'^\d{2}:\d{2}(:\d{2})?$', v):
            raise ValueError('Time must be in HH:MM or HH:MM:SS format')
        return v


class DocumentForClaim(BaseModel):
    """Schema for documents embedded in claim creation."""
    filename: str = Field(..., min_length=1, max_length=255, description="Document filename")
    file_path: str = Field(..., min_length=1, max_length=500, description="File storage path")
    file_type: Optional[str] = Field(None, max_length=100, description="MIME type")
    file_size: Optional[int] = Field(None, ge=0, description="File size in bytes")
    extracted_data: Optional[Dict[str, Any]] = Field(None, description="OCR/AI extracted data")


class ClaimCreate(ClaimBase):
    """Schema for creating a new claim."""
    documents: Optional[List[DocumentForClaim]] = Field(None, description="List of documents to attach to the claim")


class ClaimUpdate(BaseModel):
    """Schema for updating an existing claim."""
    policy_number: Optional[str] = Field(None, min_length=1, max_length=50)
    claimant_name: Optional[str] = Field(None, min_length=1, max_length=100)
    vehicle_make: Optional[str] = Field(None, max_length=50)
    vehicle_model: Optional[str] = Field(None, max_length=50)
    vehicle_year: Optional[int] = Field(None, ge=1900, le=2030)
    vehicle_vin: Optional[str] = Field(None)
    driver_present: Optional[bool] = None
    driver_name: Optional[str] = Field(None, max_length=100)
    driver_license: Optional[str] = Field(None, max_length=50)
    incident_date: Optional[str] = None
    incident_time: Optional[str] = None
    incident_location: Optional[str] = None
    weather_conditions: Optional[str] = Field(None, max_length=50)
    damage_description: Optional[str] = None
    estimated_damage: Optional[int] = Field(None, ge=0)
    injuries_reported: Optional[bool] = None
    status: Optional[str] = Field(None, max_length=20)


class DocumentBase(BaseModel):
    """Base schema for document data."""
    filename: str = Field(..., min_length=1, max_length=255, description="Document filename")
    file_path: str = Field(..., min_length=1, max_length=500, description="File storage path")
    file_type: Optional[str] = Field(None, max_length=100, description="MIME type")
    file_size: Optional[int] = Field(None, ge=0, description="File size in bytes")


class DocumentCreate(DocumentBase):
    """Schema for creating a new document."""
    claim_id: int = Field(..., description="ID of associated claim")
    extracted_data: Optional[dict] = Field(None, description="OCR/AI extracted data")


class DocumentResponse(DocumentBase):
    """Schema for document responses."""
    id: int
    claim_id: int
    upload_date: datetime
    extracted_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class InconsistencyBase(BaseModel):
    """Base schema for inconsistency data."""
    field_name: str = Field(..., min_length=1, max_length=100, description="Field name with inconsistency")
    form_value: Optional[str] = Field(None, max_length=500, description="Value from form")
    extracted_value: Optional[str] = Field(None, max_length=500, description="Value from document")
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Confidence score")


class InconsistencyCreate(InconsistencyBase):
    """Schema for creating a new inconsistency."""
    claim_id: int = Field(..., description="ID of associated claim")


class InconsistencyResponse(InconsistencyBase):
    """Schema for inconsistency responses."""
    id: int
    claim_id: int
    severity: str
    is_significant: bool

    class Config:
        from_attributes = True


class ClaimResponse(ClaimBase):
    """Schema for claim responses."""
    id: int
    submission_date: datetime
    documents: List[DocumentResponse] = []
    inconsistencies: List[InconsistencyResponse] = []

    class Config:
        from_attributes = True


class ClaimSummary(BaseModel):
    """Schema for claim summary (minimal data)."""
    id: int
    policy_number: str
    claimant_name: str
    estimated_damage: int
    status: str
    submission_date: datetime

    class Config:
        from_attributes = True


class ClaimStats(BaseModel):
    """Schema for claim statistics."""
    total_claims: int
    pending_claims: int
    processed_claims: int
    total_damage_estimate: int
    average_damage_estimate: float
    recent_claims: int  # Claims in last 30 days

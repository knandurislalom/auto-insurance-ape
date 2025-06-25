from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
import sys
import os
import json

# Add the models path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from models import get_db
from models.schemas import ClaimCreate, ClaimUpdate, ClaimResponse, ClaimStats
from app.services.claims_service import claims_service

router = APIRouter()

@router.get("/", response_model=dict)
async def get_claims(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    status: Optional[str] = Query(None, description="Filter by claim status"),
    claimant_name: Optional[str] = Query(None, description="Filter by claimant name (partial match)"),
    policy_number: Optional[str] = Query(None, description="Filter by policy number"),
    date_from: Optional[str] = Query(None, description="Filter claims from this date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter claims to this date (YYYY-MM-DD)"),
    sort_by: str = Query("submission_date", description="Field to sort by"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    db: Session = Depends(get_db)
):
    """Get all claims with filtering and sorting options"""
    try:
        result = await claims_service.get_all_claims(
            db=db,
            skip=skip,
            limit=limit,
            status=status,
            claimant_name=claimant_name,
            policy_number=policy_number,
            date_from=date_from,
            date_to=date_to,
            sort_by=sort_by,
            sort_order=sort_order
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving claims: {str(e)}"
        )

@router.post("/", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
async def create_claim(
    policy_number: str = Form(...),
    claimant_name: str = Form(...),
    estimated_damage: int = Form(...),
    vehicle_make: Optional[str] = Form(None),
    vehicle_model: Optional[str] = Form(None),
    vehicle_year: Optional[int] = Form(None),
    vehicle_vin: Optional[str] = Form(None),
    driver_present: Optional[bool] = Form(True),
    driver_name: Optional[str] = Form(None),
    driver_license: Optional[str] = Form(None),
    incident_date: Optional[str] = Form(None),
    incident_time: Optional[str] = Form(None),
    incident_location: Optional[str] = Form(None),
    weather_conditions: Optional[str] = Form(None),
    damage_description: Optional[str] = Form(None),
    injuries_reported: Optional[bool] = Form(False),
    claim_status: Optional[str] = Form("pending"),
    files: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db)
):
    """Create a new insurance claim with file uploads"""
    try:
        # Create ClaimCreate object from form data
        claim_data = ClaimCreate(
            policy_number=policy_number,
            claimant_name=claimant_name,
            estimated_damage=estimated_damage,
            vehicle_make=vehicle_make,
            vehicle_model=vehicle_model,
            vehicle_year=vehicle_year,
            vehicle_vin=vehicle_vin,
            driver_present=driver_present,
            driver_name=driver_name,
            driver_license=driver_license,
            incident_date=incident_date,
            incident_time=incident_time,
            incident_location=incident_location,
            weather_conditions=weather_conditions,
            damage_description=damage_description,
            injuries_reported=injuries_reported,
            status=claim_status
        )
        
        # Create claim with uploaded files
        claim = await claims_service.create_claim_with_files(
            db=db, 
            claim_data=claim_data, 
            uploaded_files=files
        )
        
        return claim
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating claim: {str(e)}"
        ) from e

@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(
    claim_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific claim by ID"""
    try:
        claim = await claims_service.get_claim_by_id(db=db, claim_id=claim_id)
        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Claim {claim_id} not found"
            )
        return claim
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving claim: {str(e)}"
        )

@router.put("/{claim_id}/status", response_model=ClaimResponse)
async def update_claim_status(
    claim_id: int,
    new_status: str,
    notes: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update the status of a claim"""
    try:
        claim = await claims_service.update_claim_status(
            db=db,
            claim_id=claim_id,
            new_status=new_status,
            notes=notes
        )
        if not claim:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Claim {claim_id} not found"
            )
        return claim
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating claim status: {str(e)}"
        )

@router.get("/statistics/overview", response_model=ClaimStats)
async def get_claims_statistics(db: Session = Depends(get_db)):
    """Get comprehensive statistics about claims"""
    try:
        stats = await claims_service.get_claims_statistics(db=db)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving statistics: {str(e)}"
        )

@router.post("/{claim_id}/documents")
async def add_document_to_claim(
    claim_id: int,
    filename: str,
    file_path: str,
    file_type: Optional[str] = None,
    file_size: Optional[int] = None,
    extracted_data: Optional[dict] = None,
    db: Session = Depends(get_db)
):
    """Add a document to an existing claim"""
    try:
        from models.schemas import DocumentCreate
        
        document_data = DocumentCreate(
            claim_id=claim_id,
            filename=filename,
            file_path=file_path,
            file_type=file_type,
            file_size=file_size,
            extracted_data=extracted_data
        )
        
        document = await claims_service.add_document_to_claim(
            db=db,
            claim_id=claim_id,
            document_data=document_data
        )
        return document
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding document: {str(e)}"
        )

@router.post("/{claim_id}/detect-inconsistencies")
async def detect_inconsistencies(
    claim_id: int,
    form_data: dict,
    extracted_data: dict,
    db: Session = Depends(get_db)
):
    """Detect and record inconsistencies between form data and extracted data"""
    try:
        inconsistencies = await claims_service.detect_inconsistencies(
            db=db,
            claim_id=claim_id,
            form_data=form_data,
            extracted_data=extracted_data
        )
        return {
            "claim_id": claim_id,
            "inconsistencies_detected": len(inconsistencies),
            "inconsistencies": inconsistencies
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error detecting inconsistencies: {str(e)}"
        )

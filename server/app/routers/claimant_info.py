"""
ClaimantInfo router for the Auto Insurance API.

This module provides API endpoints for managing claimant contact information,
including CRUD operations for email addresses and phone numbers.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from models import get_db
from models.crud import claimant_info_crud
from models.schemas import (
    ClaimantInfoCreate, 
    ClaimantInfoUpdate, 
    ClaimantInfo as ClaimantInfoSchema
)

router = APIRouter()


@router.post("/", response_model=ClaimantInfoSchema, status_code=status.HTTP_201_CREATED)
async def create_claimant_info(
    claimant_info_data: ClaimantInfoCreate,
    db: Session = Depends(get_db)
):
    """
    Create new claimant contact information.
    
    Args:
        claimant_info_data: Claimant contact information to create
        db: Database session
    
    Returns:
        Created claimant info record
    """
    return claimant_info_crud.create(db=db, claimant_info_data=claimant_info_data)


@router.get("/{claimant_info_id}", response_model=ClaimantInfoSchema)
async def get_claimant_info(
    claimant_info_id: int,
    db: Session = Depends(get_db)
):
    """
    Get claimant contact information by ID.
    
    Args:
        claimant_info_id: ID of the claimant info record
        db: Database session
    
    Returns:
        Claimant info record
    """
    claimant_info = claimant_info_crud.get(db=db, claimant_info_id=claimant_info_id)
    if not claimant_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claimant info with id {claimant_info_id} not found"
        )
    return claimant_info


@router.get("/", response_model=List[ClaimantInfoSchema])
async def list_claimant_info(
    skip: int = 0,
    limit: int = 100,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List claimant contact information with optional filtering.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        email: Filter by email address
        phone: Filter by phone number
        db: Database session
    
    Returns:
        List of claimant info records
    """
    if email:
        return claimant_info_crud.get_by_email(db=db, email=email)
    elif phone:
        return claimant_info_crud.get_by_phone(db=db, phone=phone)
    else:
        return claimant_info_crud.get_multi(db=db, skip=skip, limit=limit)


@router.put("/{claimant_info_id}", response_model=ClaimantInfoSchema)
async def update_claimant_info(
    claimant_info_id: int,
    claimant_info_update: ClaimantInfoUpdate,
    db: Session = Depends(get_db)
):
    """
    Update claimant contact information.
    
    Args:
        claimant_info_id: ID of the claimant info record
        claimant_info_update: Updated claimant info data
        db: Database session
    
    Returns:
        Updated claimant info record
    """
    claimant_info = claimant_info_crud.update(
        db=db, 
        claimant_info_id=claimant_info_id, 
        claimant_info_update=claimant_info_update
    )
    if not claimant_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claimant info with id {claimant_info_id} not found"
        )
    return claimant_info


@router.delete("/{claimant_info_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_claimant_info(
    claimant_info_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete claimant contact information.
    
    Args:
        claimant_info_id: ID of the claimant info record
        db: Database session
    """
    success = claimant_info_crud.delete(db=db, claimant_info_id=claimant_info_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Claimant info with id {claimant_info_id} not found"
        )

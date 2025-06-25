"""
Claims Service - Business logic for insurance claim operations.

This service module handles all the business logic for insurance claims,
including CRUD operations, status management, validation, and data processing.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from datetime import datetime, timedelta
import json
import logging
import os
import uuid
from pathlib import Path
import aiofiles

# Import models and schemas from the models package
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from models import get_db, Claim, Document, Inconsistency
from models.schemas import (
    ClaimCreate, ClaimUpdate, ClaimResponse, ClaimSummary, ClaimStats,
    DocumentCreate, InconsistencyCreate
)
from models.crud import claim_crud, document_crud, inconsistency_crud

# Set up logging
logger = logging.getLogger(__name__)


class ClaimsService:
    """Service class for handling insurance claim business logic."""
    
    def __init__(self):
        """Initialize the claims service."""
        self.valid_statuses = [
            'pending', 'under_review', 'approved', 'denied', 
            'requires_documentation', 'processed', 'closed'
        ]
    
    async def get_all_claims(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        claimant_name: Optional[str] = None,
        policy_number: Optional[str] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        sort_by: str = "submission_date",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        """
        Get all claims with advanced filtering and sorting options.
        
        Args:
            db: Database session
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            status: Filter by claim status
            claimant_name: Filter by claimant name (partial match)
            policy_number: Filter by policy number
            date_from: Filter claims from this date (YYYY-MM-DD)
            date_to: Filter claims to this date (YYYY-MM-DD)
            sort_by: Field to sort by
            sort_order: Sort order (asc/desc)
        
        Returns:
            Dictionary containing claims and metadata
        """
        try:
            # Build query with filters
            query = db.query(Claim)
            
            # Apply filters
            if status:
                query = query.filter(Claim.status == status)
            
            if claimant_name:
                query = query.filter(Claim.claimant_name.ilike(f"%{claimant_name}%"))
            
            if policy_number:
                query = query.filter(Claim.policy_number == policy_number)
            
            if date_from:
                try:
                    from_date = datetime.strptime(date_from, "%Y-%m-%d")
                    query = query.filter(Claim.submission_date >= from_date)
                except ValueError:
                    logger.warning(f"Invalid date_from format: {date_from}")
            
            if date_to:
                try:
                    to_date = datetime.strptime(date_to, "%Y-%m-%d")
                    query = query.filter(Claim.submission_date <= to_date)
                except ValueError:
                    logger.warning(f"Invalid date_to format: {date_to}")
            
            # Apply sorting
            sort_field = getattr(Claim, sort_by, Claim.submission_date)
            if sort_order.lower() == "desc":
                query = query.order_by(desc(sort_field))
            else:
                query = query.order_by(sort_field)
            
            # Get total count before pagination
            total_count = query.count()
            
            # Apply pagination
            claims = query.offset(skip).limit(limit).all()
            
            # Convert to response format
            claims_data = []
            for claim in claims:
                claim_dict = claim.to_dict()
                claim_dict['document_count'] = len(claim.documents)
                claim_dict['inconsistency_count'] = len(claim.inconsistencies)
                claims_data.append(claim_dict)
            
            return {
                "claims": claims_data,
                "total_count": total_count,
                "page": skip // limit + 1 if limit > 0 else 1,
                "page_size": limit,
                "has_next": (skip + limit) < total_count,
                "has_previous": skip > 0
            }
            
        except Exception as e:
            logger.error(f"Error getting claims: {str(e)}")
            raise
    
    async def create_claim(self, db: Session, claim_data: ClaimCreate) -> ClaimResponse:
        """
        Create a new insurance claim with validation and document handling.
        
        Args:
            db: Database session
            claim_data: Claim creation data
        
        Returns:
            Created claim data with associated documents
        """
        try:
            # Validate claim data
            await self._validate_claim_data(claim_data)
            
            # Extract documents from claim data before creating claim
            documents_data = claim_data.documents if claim_data.documents else []
            
            # Create the claim first (without documents field)
            claim = claim_crud.create(db=db, claim_data=claim_data)
            
            logger.info("Created new claim with ID: %s", claim.id)
            
            # Now create associated documents if any
            if documents_data:
                await self._create_claim_documents(db, claim.id, documents_data)
                logger.info("Created %s documents for claim %s", len(documents_data), claim.id)
            
            # Refresh claim to get updated relationships
            db.refresh(claim)
            
            return claim
            
        except Exception as e:
            logger.error("Error creating claim: %s", str(e))
            raise
    
    async def _create_claim_documents(
        self, 
        db: Session, 
        claim_id: int, 
        documents_data: List[dict]
    ) -> None:
        """
        Create documents associated with a claim.
        
        Args:
            db: Database session
            claim_id: ID of the claim to associate documents with
            documents_data: List of document data dictionaries
        """
        for doc_data in documents_data:
            try:
                # Convert dict to DocumentCreate if needed
                if isinstance(doc_data, dict):
                    document_create = DocumentCreate(
                        claim_id=claim_id,
                        filename=doc_data.get('filename', ''),
                        file_path=doc_data.get('file_path', ''),
                        file_type=doc_data.get('file_type'),
                        file_size=doc_data.get('file_size'),
                        extracted_data=doc_data.get('extracted_data')
                    )
                else:
                    # Already a DocumentForClaim object
                    document_create = DocumentCreate(
                        claim_id=claim_id,
                        filename=doc_data.filename,
                        file_path=doc_data.file_path,
                        file_type=doc_data.file_type,
                        file_size=doc_data.file_size,
                        extracted_data=doc_data.extracted_data
                    )
                
                document = document_crud.create(db=db, document_data=document_create)
                logger.info("Created document %s for claim %s", document.id, claim_id)
                
            except Exception as e:
                logger.error("Error creating document for claim %s: %s", claim_id, str(e))
                # Continue with other documents even if one fails
                continue
    
    async def get_claim_by_id(self, db: Session, claim_id: int) -> Optional[ClaimResponse]:
        """
        Get a specific claim by ID with all related data.
        
        Args:
            db: Database session
            claim_id: ID of the claim to retrieve
        
        Returns:
            Claim data with documents and inconsistencies, or None if not found
        """
        try:
            claim = claim_crud.get(db=db, claim_id=claim_id)
            
            if not claim:
                return None
            
            # Add additional metadata
            claim_dict = claim.to_dict()
            claim_dict['documents'] = [doc.to_dict() for doc in claim.documents]
            claim_dict['inconsistencies'] = [inc.to_dict() for inc in claim.inconsistencies]
            claim_dict['full_vehicle_info'] = claim.full_vehicle_info
            claim_dict['is_recent'] = claim.is_recent
            
            return claim_dict
            
        except Exception as e:
            logger.error(f"Error getting claim {claim_id}: {str(e)}")
            raise
    
    async def update_claim_status(
        self, 
        db: Session, 
        claim_id: int, 
        new_status: str,
        notes: Optional[str] = None
    ) -> Optional[ClaimResponse]:
        """
        Update the status of a claim with validation and logging.
        
        Args:
            db: Database session
            claim_id: ID of the claim to update
            new_status: New status for the claim
            notes: Optional notes about the status change
        
        Returns:
            Updated claim data, or None if not found
        """
        try:
            # Validate new status
            if new_status not in self.valid_statuses:
                raise ValueError(f"Invalid status: {new_status}. Valid statuses: {self.valid_statuses}")
            
            # Get existing claim
            claim = claim_crud.get(db=db, claim_id=claim_id)
            if not claim:
                return None
            
            old_status = claim.status
            
            # Update the claim
            update_data = ClaimUpdate(status=new_status)
            updated_claim = claim_crud.update(db=db, claim_id=claim_id, claim_data=update_data)
            
            # Log the status change
            logger.info(f"Claim {claim_id} status changed from '{old_status}' to '{new_status}'")
            
            if notes:
                logger.info(f"Status change notes for claim {claim_id}: {notes}")
            
            return updated_claim
            
        except Exception as e:
            logger.error(f"Error updating claim {claim_id} status: {str(e)}")
            raise
    
    async def get_claims_statistics(self, db: Session) -> ClaimStats:
        """
        Get comprehensive statistics about claims.
        
        Args:
            db: Database session
        
        Returns:
            Claims statistics
        """
        try:
            stats = claim_crud.get_statistics(db=db)
            
            # Add additional statistics
            thirty_days_ago = datetime.now() - timedelta(days=30)
            recent_high_value = db.query(Claim).filter(
                and_(
                    Claim.submission_date >= thirty_days_ago,
                    Claim.estimated_damage > 10000
                )
            ).count()
            
            stats['recent_high_value_claims'] = recent_high_value
            stats['average_processing_time_days'] = await self._calculate_avg_processing_time(db)
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting claims statistics: {str(e)}")
            raise
    
    async def add_document_to_claim(
        self, 
        db: Session, 
        claim_id: int, 
        document_data: DocumentCreate
    ) -> Dict[str, Any]:
        """
        Add a document to an existing claim.
        
        Args:
            db: Database session
            claim_id: ID of the claim
            document_data: Document data to add
        
        Returns:
            Created document data
        """
        try:
            # Verify claim exists
            claim = claim_crud.get(db=db, claim_id=claim_id)
            if not claim:
                raise ValueError(f"Claim {claim_id} not found")
            
            # Set claim_id in document data
            document_data.claim_id = claim_id
            
            # Create the document
            document = document_crud.create(db=db, document_data=document_data)
            
            logger.info(f"Added document {document.id} to claim {claim_id}")
            
            return document.to_dict()
            
        except Exception as e:
            logger.error(f"Error adding document to claim {claim_id}: {str(e)}")
            raise
    
    async def detect_inconsistencies(
        self, 
        db: Session, 
        claim_id: int, 
        form_data: Dict[str, Any], 
        extracted_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Detect and record inconsistencies between form data and extracted data.
        
        Args:
            db: Database session
            claim_id: ID of the claim
            form_data: Data from the claim form
            extracted_data: Data extracted from documents (OCR/AI)
        
        Returns:
            List of detected inconsistencies
        """
        try:
            inconsistencies = []
            
            # Compare common fields
            fields_to_compare = [
                'driver_license', 'vehicle_vin', 'policy_number', 
                'claimant_name', 'incident_date'
            ]
            
            for field in fields_to_compare:
                form_value = form_data.get(field)
                extracted_value = extracted_data.get(field)
                
                if form_value and extracted_value:
                    confidence_score = self._calculate_similarity(form_value, extracted_value)
                    
                    if confidence_score < 0.9:  # Threshold for inconsistency
                        inconsistency_data = InconsistencyCreate(
                            claim_id=claim_id,
                            field_name=field,
                            form_value=str(form_value),
                            extracted_value=str(extracted_value),
                            confidence_score=confidence_score
                        )
                        
                        inconsistency = inconsistency_crud.create(
                            db=db, 
                            inconsistency_data=inconsistency_data
                        )
                        
                        inconsistencies.append(inconsistency.to_dict())
            
            logger.info(f"Detected {len(inconsistencies)} inconsistencies for claim {claim_id}")
            
            return inconsistencies
            
        except Exception as e:
            logger.error(f"Error detecting inconsistencies for claim {claim_id}: {str(e)}")
            raise
    
    async def create_claim_with_files(
        self, 
        db: Session, 
        claim_data: ClaimCreate, 
        uploaded_files: List[Any]
    ) -> ClaimResponse:
        """
        Create a new insurance claim with file uploads.
        
        Args:
            db: Database session
            claim_data: Claim creation data
            uploaded_files: List of UploadFile objects
        
        Returns:
            Created claim data with associated documents
        """
        try:
            # Validate claim data
            await self._validate_claim_data(claim_data)
            
            # Create the claim first (without documents)
            claim = claim_crud.create(db=db, claim_data=claim_data)
            
            logger.info("Created new claim with ID: %s", claim.id)
            
            # Process and save uploaded files if any
            if uploaded_files:
                await self._process_uploaded_files(db, claim.id, uploaded_files)
                logger.info("Processed %s uploaded files for claim %s", len(uploaded_files), claim.id)
            
            # Refresh claim to get updated relationships
            db.refresh(claim)
            
            return claim
            
        except Exception as e:
            logger.error("Error creating claim with files: %s", str(e))
            raise

    async def _process_uploaded_files(
        self, 
        db: Session, 
        claim_id: int, 
        uploaded_files: List[Any]
    ) -> None:
        """
        Process uploaded files, save them to disk, and create document records.
        
        Args:
            db: Database session
            claim_id: ID of the claim to associate files with
            uploaded_files: List of UploadFile objects
        """
        # Ensure upload directory exists
        upload_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        for uploaded_file in uploaded_files:
            if not uploaded_file or not uploaded_file.filename:
                continue
                
            try:
                # Read file content first to validate
                content = await uploaded_file.read()
                
                # Validate file size (max 50MB)
                max_file_size = 50 * 1024 * 1024  # 50MB
                if len(content) > max_file_size:
                    logger.warning("File %s too large (%s bytes), skipping", uploaded_file.filename, len(content))
                    continue
                
                # Skip empty files
                if len(content) == 0:
                    logger.warning("File %s is empty, skipping", uploaded_file.filename)
                    continue
                
                # Generate unique filename to avoid conflicts
                file_extension = Path(uploaded_file.filename).suffix
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                file_path = os.path.join(upload_dir, unique_filename)
                
                # Save file to disk
                async with aiofiles.open(file_path, 'wb') as f:
                    await f.write(content)
                
                # Get file metadata
                file_size = len(content)
                content_type = uploaded_file.content_type or 'application/octet-stream'
                
                # Create document record
                document_create = DocumentCreate(
                    claim_id=claim_id,
                    filename=uploaded_file.filename,
                    file_path=file_path,
                    file_type=content_type,
                    file_size=file_size,
                    extracted_data=None  # Can be populated later with OCR/AI processing
                )
                
                document = document_crud.create(db=db, document_data=document_create)
                logger.info("Created document %s for claim %s: %s", document.id, claim_id, uploaded_file.filename)
                
            except Exception as e:
                logger.error("Error processing file %s for claim %s: %s", uploaded_file.filename, claim_id, str(e))
                # Continue with other files even if one fails
                continue

    async def _validate_claim_data(self, claim_data: ClaimCreate) -> None:
        """Validate claim data before creation."""
        # Check required fields
        if not claim_data.policy_number:
            raise ValueError("Policy number is required")
        
        if not claim_data.claimant_name:
            raise ValueError("Claimant name is required")
        
        if claim_data.estimated_damage < 0:
            raise ValueError("Estimated damage cannot be negative")
        
        # Validate incident date format if provided
        if claim_data.incident_date:
            try:
                datetime.strptime(claim_data.incident_date, "%Y-%m-%d")
            except ValueError:
                raise ValueError("Incident date must be in YYYY-MM-DD format")
    
    async def _calculate_avg_processing_time(self, db: Session) -> float:
        """Calculate average processing time for completed claims."""
        try:
            processed_claims = db.query(Claim).filter(
                Claim.status.in_(['approved', 'denied', 'processed', 'closed'])
            ).all()
            
            if not processed_claims:
                return 0.0
            
            total_days = 0
            count = 0
            
            for claim in processed_claims:
                if claim.submission_date:
                    # Assume processing time is from submission to now
                    # In a real system, you'd track actual completion date
                    days_diff = (datetime.now() - claim.submission_date).days
                    total_days += days_diff
                    count += 1
            
            return round(total_days / count, 2) if count > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating average processing time: {str(e)}")
            return 0.0
    
    def _calculate_similarity(self, value1: str, value2: str) -> float:
        """Calculate similarity score between two string values."""
        if value1 == value2:
            return 1.0
        
        # Simple similarity calculation
        # In a real system, you might use more sophisticated algorithms
        value1_clean = value1.lower().strip()
        value2_clean = value2.lower().strip()
        
        if value1_clean == value2_clean:
            return 0.95
        
        # Calculate character-level similarity
        if len(value1_clean) == 0 and len(value2_clean) == 0:
            return 1.0
        
        max_len = max(len(value1_clean), len(value2_clean))
        if max_len == 0:
            return 1.0
        
        # Simple character difference ratio
        differences = sum(c1 != c2 for c1, c2 in zip(value1_clean, value2_clean))
        differences += abs(len(value1_clean) - len(value2_clean))
        
        similarity = 1.0 - (differences / max_len)
        return max(0.0, similarity)


# Create a singleton instance for easy import
claims_service = ClaimsService()

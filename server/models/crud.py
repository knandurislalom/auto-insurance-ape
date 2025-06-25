"""
CRUD operations for the Auto Insurance system.

This module provides Create, Read, Update, Delete operations
for all database models using SQLAlchemy.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from .claim import Claim
from .document import Document
from .inconsistency import Inconsistency
from .schemas import ClaimCreate, ClaimUpdate, DocumentCreate, InconsistencyCreate


class ClaimCRUD:
    """CRUD operations for Claims."""
    
    @staticmethod
    def create(db: Session, claim_data: ClaimCreate) -> Claim:
        """Create a new claim."""
        # Convert claim data to dict and exclude documents field
        claim_dict = claim_data.model_dump()
        claim_dict.pop('documents', None)  # Remove documents field if present
        
        db_claim = Claim(**claim_dict)
        db.add(db_claim)
        db.commit()
        db.refresh(db_claim)
        return db_claim
    
    @staticmethod
    def get(db: Session, claim_id: int) -> Optional[Claim]:
        """Get a claim by ID."""
        return db.query(Claim).filter(Claim.id == claim_id).first()
    
    @staticmethod
    def get_by_policy_number(db: Session, policy_number: str) -> List[Claim]:
        """Get claims by policy number."""
        return db.query(Claim).filter(Claim.policy_number == policy_number).all()
    
    @staticmethod
    def get_multi(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        status: Optional[str] = None,
        claimant_name: Optional[str] = None
    ) -> List[Claim]:
        """Get multiple claims with optional filtering."""
        query = db.query(Claim)
        
        if status:
            query = query.filter(Claim.status == status)
        
        if claimant_name:
            query = query.filter(Claim.claimant_name.ilike(f"%{claimant_name}%"))
        
        return query.order_by(desc(Claim.submission_date)).offset(skip).limit(limit).all()
    
    @staticmethod
    def update(db: Session, claim_id: int, claim_data: ClaimUpdate) -> Optional[Claim]:
        """Update a claim."""
        db_claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if db_claim:
            update_data = claim_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_claim, field, value)
            db.commit()
            db.refresh(db_claim)
        return db_claim
    
    @staticmethod
    def delete(db: Session, claim_id: int) -> bool:
        """Delete a claim."""
        db_claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if db_claim:
            db.delete(db_claim)
            db.commit()
            return True
        return False
    
    @staticmethod
    def get_statistics(db: Session) -> Dict[str, Any]:
        """Get claim statistics."""
        total_claims = db.query(Claim).count()
        pending_claims = db.query(Claim).filter(Claim.status == 'pending').count()
        processed_claims = db.query(Claim).filter(Claim.status != 'pending').count()
        
        # Calculate damage statistics
        damage_query = db.query(Claim.estimated_damage).filter(Claim.estimated_damage > 0)
        total_damage = sum(claim.estimated_damage for claim in damage_query.all())
        avg_damage = total_damage / total_claims if total_claims > 0 else 0
        
        # Recent claims (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_claims = db.query(Claim).filter(Claim.submission_date >= thirty_days_ago).count()
        
        return {
            'total_claims': total_claims,
            'pending_claims': pending_claims,
            'processed_claims': processed_claims,
            'total_damage_estimate': total_damage,
            'average_damage_estimate': round(avg_damage, 2),
            'recent_claims': recent_claims
        }


class DocumentCRUD:
    """CRUD operations for Documents."""
    
    @staticmethod
    def create(db: Session, document_data: DocumentCreate) -> Document:
        """Create a new document."""
        # Convert the data to dict and handle extracted_data separately
        data_dict = document_data.model_dump()
        extracted_data = data_dict.pop('extracted_data', None)
        
        # Create the document instance
        db_document = Document(**data_dict)
        
        # Set extracted data using the property
        if extracted_data:
            db_document.extracted_data = extracted_data
        
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        return db_document
    
    @staticmethod
    def get(db: Session, document_id: int) -> Optional[Document]:
        """Get a document by ID."""
        return db.query(Document).filter(Document.id == document_id).first()
    
    @staticmethod
    def get_by_claim(db: Session, claim_id: int) -> List[Document]:
        """Get all documents for a specific claim."""
        return db.query(Document).filter(Document.claim_id == claim_id).all()
    
    @staticmethod
    def get_multi(
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        file_type: Optional[str] = None
    ) -> List[Document]:
        """Get multiple documents with optional filtering."""
        query = db.query(Document)
        
        if file_type:
            query = query.filter(Document.file_type.like(f"{file_type}%"))
        
        return query.order_by(desc(Document.upload_date)).offset(skip).limit(limit).all()
    
    @staticmethod
    def delete(db: Session, document_id: int) -> bool:
        """Delete a document."""
        db_document = db.query(Document).filter(Document.id == document_id).first()
        if db_document:
            db.delete(db_document)
            db.commit()
            return True
        return False


class InconsistencyCRUD:
    """CRUD operations for Inconsistencies."""
    
    @staticmethod
    def create(db: Session, inconsistency_data: InconsistencyCreate) -> Inconsistency:
        """Create a new inconsistency."""
        db_inconsistency = Inconsistency(**inconsistency_data.model_dump())
        db.add(db_inconsistency)
        db.commit()
        db.refresh(db_inconsistency)
        return db_inconsistency
    
    @staticmethod
    def get(db: Session, inconsistency_id: int) -> Optional[Inconsistency]:
        """Get an inconsistency by ID."""
        return db.query(Inconsistency).filter(Inconsistency.id == inconsistency_id).first()
    
    @staticmethod
    def get_by_claim(db: Session, claim_id: int) -> List[Inconsistency]:
        """Get all inconsistencies for a specific claim."""
        return db.query(Inconsistency).filter(Inconsistency.claim_id == claim_id).all()
    
    @staticmethod
    def get_significant(db: Session, min_confidence: float = 0.7) -> List[Inconsistency]:
        """Get inconsistencies with confidence score above threshold."""
        return db.query(Inconsistency).filter(
            Inconsistency.confidence_score >= min_confidence
        ).all()
    
    @staticmethod
    def delete(db: Session, inconsistency_id: int) -> bool:
        """Delete an inconsistency."""
        db_inconsistency = db.query(Inconsistency).filter(Inconsistency.id == inconsistency_id).first()
        if db_inconsistency:
            db.delete(db_inconsistency)
            db.commit()
            return True
        return False


# Convenience instances for easy import
claim_crud = ClaimCRUD()
document_crud = DocumentCRUD()
inconsistency_crud = InconsistencyCRUD()

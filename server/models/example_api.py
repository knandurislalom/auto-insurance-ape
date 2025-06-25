"""
Example usage of SQLAlchemy models in FastAPI application.

This file demonstrates how to use the models, schemas, and CRUD operations
in a FastAPI application for the Auto Insurance system.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

# Import models and dependencies
from models import get_db, create_tables
from models.schemas import (
    ClaimCreate, ClaimUpdate, ClaimResponse, ClaimSummary, ClaimStats,
    DocumentCreate, DocumentResponse,
    InconsistencyCreate, InconsistencyResponse
)
from models.crud import claim_crud, document_crud, inconsistency_crud

# Create FastAPI app
app = FastAPI(
    title="Auto Insurance Claim API",
    description="API for managing auto insurance claims, documents, and inconsistencies",
    version="1.0.0"
)

# Create tables on startup
@app.on_event("startup")
def startup_event():
    """Create database tables on application startup."""
    create_tables()


# Claim endpoints
@app.post("/claims/", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(claim: ClaimCreate, db: Session = Depends(get_db)):
    """Create a new insurance claim."""
    return claim_crud.create(db=db, claim_data=claim)


@app.get("/claims/", response_model=List[ClaimSummary])
def read_claims(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    claimant_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get a list of claims with optional filtering."""
    claims = claim_crud.get_multi(
        db=db, 
        skip=skip, 
        limit=limit, 
        status=status_filter, 
        claimant_name=claimant_name
    )
    return claims


@app.get("/claims/{claim_id}", response_model=ClaimResponse)
def read_claim(claim_id: int, db: Session = Depends(get_db)):
    """Get a specific claim by ID."""
    claim = claim_crud.get(db=db, claim_id=claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@app.put("/claims/{claim_id}", response_model=ClaimResponse)
def update_claim(claim_id: int, claim: ClaimUpdate, db: Session = Depends(get_db)):
    """Update an existing claim."""
    db_claim = claim_crud.update(db=db, claim_id=claim_id, claim_data=claim)
    if db_claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return db_claim


@app.delete("/claims/{claim_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_claim(claim_id: int, db: Session = Depends(get_db)):
    """Delete a claim."""
    success = claim_crud.delete(db=db, claim_id=claim_id)
    if not success:
        raise HTTPException(status_code=404, detail="Claim not found")


@app.get("/claims/policy/{policy_number}", response_model=List[ClaimSummary])
def read_claims_by_policy(policy_number: str, db: Session = Depends(get_db)):
    """Get all claims for a specific policy number."""
    claims = claim_crud.get_by_policy_number(db=db, policy_number=policy_number)
    return claims


@app.get("/statistics/claims", response_model=ClaimStats)
def get_claim_statistics(db: Session = Depends(get_db)):
    """Get claim statistics and summary information."""
    return claim_crud.get_statistics(db=db)


# Document endpoints
@app.post("/documents/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def create_document(document: DocumentCreate, db: Session = Depends(get_db)):
    """Upload a new document for a claim."""
    # Verify the claim exists
    claim = claim_crud.get(db=db, claim_id=document.claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return document_crud.create(db=db, document_data=document)


@app.get("/documents/", response_model=List[DocumentResponse])
def read_documents(
    skip: int = 0,
    limit: int = 100,
    file_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get a list of documents with optional filtering."""
    documents = document_crud.get_multi(
        db=db, 
        skip=skip, 
        limit=limit, 
        file_type=file_type
    )
    return documents


@app.get("/documents/{document_id}", response_model=DocumentResponse)
def read_document(document_id: int, db: Session = Depends(get_db)):
    """Get a specific document by ID."""
    document = document_crud.get(db=db, document_id=document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@app.get("/claims/{claim_id}/documents", response_model=List[DocumentResponse])
def read_claim_documents(claim_id: int, db: Session = Depends(get_db)):
    """Get all documents for a specific claim."""
    # Verify the claim exists
    claim = claim_crud.get(db=db, claim_id=claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    documents = document_crud.get_by_claim(db=db, claim_id=claim_id)
    return documents


@app.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Delete a document."""
    success = document_crud.delete(db=db, document_id=document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")


# Inconsistency endpoints
@app.post("/inconsistencies/", response_model=InconsistencyResponse, status_code=status.HTTP_201_CREATED)
def create_inconsistency(inconsistency: InconsistencyCreate, db: Session = Depends(get_db)):
    """Create a new inconsistency record."""
    # Verify the claim exists
    claim = claim_crud.get(db=db, claim_id=inconsistency.claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return inconsistency_crud.create(db=db, inconsistency_data=inconsistency)


@app.get("/inconsistencies/significant", response_model=List[InconsistencyResponse])
def read_significant_inconsistencies(
    min_confidence: float = 0.7,
    db: Session = Depends(get_db)
):
    """Get inconsistencies with high confidence scores."""
    inconsistencies = inconsistency_crud.get_significant(db=db, min_confidence=min_confidence)
    return inconsistencies


@app.get("/claims/{claim_id}/inconsistencies", response_model=List[InconsistencyResponse])
def read_claim_inconsistencies(claim_id: int, db: Session = Depends(get_db)):
    """Get all inconsistencies for a specific claim."""
    # Verify the claim exists
    claim = claim_crud.get(db=db, claim_id=claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    inconsistencies = inconsistency_crud.get_by_claim(db=db, claim_id=claim_id)
    return inconsistencies


@app.delete("/inconsistencies/{inconsistency_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inconsistency(inconsistency_id: int, db: Session = Depends(get_db)):
    """Delete an inconsistency record."""
    success = inconsistency_crud.delete(db=db, inconsistency_id=inconsistency_id)
    if not success:
        raise HTTPException(status_code=404, detail="Inconsistency not found")


# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Auto Insurance API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

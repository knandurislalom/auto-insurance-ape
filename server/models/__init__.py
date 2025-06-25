"""
SQLAlchemy models for the Auto Insurance system.

This package contains all the database models used in the application:
- Claim: Insurance claim information
- Document: Uploaded documents and files
- Inconsistency: Data inconsistencies between forms and documents

Usage:
    from models import Claim, Document, Inconsistency, get_db, create_tables
    
    # Create all tables
    create_tables()
    
    # Use in FastAPI endpoints
    @app.post("/claims/")
    def create_claim(claim_data: dict, db: Session = Depends(get_db)):
        claim = Claim(**claim_data)
        db.add(claim)
        db.commit()
        return claim
"""

from .database import Base, engine, SessionLocal, get_db, create_tables, drop_tables
from .claim import Claim
from .document import Document
from .inconsistency import Inconsistency
from .claimant_info import ClaimantInfo

# Make all models available at package level
__all__ = [
    "Base",
    "engine", 
    "SessionLocal",
    "get_db",
    "create_tables",
    "drop_tables",
    "Claim",
    "Document", 
    "Inconsistency",
    "ClaimantInfo"
]

# Import all models to ensure they are registered with SQLAlchemy
# This is important for relationship resolution and table creation
def import_all_models():
    """Import all models to ensure they are registered with SQLAlchemy."""
    return [Claim, Document, Inconsistency, ClaimantInfo]

# Version information
__version__ = "1.0.0"

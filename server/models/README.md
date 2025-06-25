# SQLAlchemy Models for Auto Insurance System

This directory contains the SQLAlchemy ORM models for the Auto Insurance claim intake system.

## Files Overview

- `database.py` - Database configuration and connection setup
- `claim.py` - Claim model for insurance claim data
- `document.py` - Document model for uploaded files and documents
- `inconsistency.py` - Inconsistency model for data validation tracking
- `schemas.py` - Pydantic schemas for API request/response validation
- `crud.py` - CRUD (Create, Read, Update, Delete) operations
- `example_api.py` - Example FastAPI application using the models
- `__init__.py` - Package initialization and exports

## Installation

Make sure you have the required dependencies installed:

```bash
pip install -r ../requirements.txt
```

Key dependencies:
- SQLAlchemy 2.0+
- Pydantic 2.0+
- FastAPI (for API example)

## Quick Start

### 1. Create Database Tables

```python
from models import create_tables

# Create all tables in the database
create_tables()
```

### 2. Basic Usage

```python
from models import get_db, Claim, Document, Inconsistency
from models.schemas import ClaimCreate
from sqlalchemy.orm import Session

# Create a new claim
def create_claim_example():
    # Get database session
    db = next(get_db())
    
    # Create claim data
    claim_data = ClaimCreate(
        policy_number="POL123456789",
        claimant_name="John Doe",
        vehicle_make="Toyota",
        vehicle_model="Camry",
        vehicle_year=2020,
        estimated_damage=2500,
        incident_date="2024-12-24",
        incident_location="123 Main St, Anytown, ST"
    )
    
    # Create claim in database
    claim = Claim(**claim_data.model_dump())
    db.add(claim)
    db.commit()
    db.refresh(claim)
    
    return claim
```

### 3. Using CRUD Operations

```python
from models.crud import claim_crud, document_crud
from models.schemas import ClaimCreate, DocumentCreate

# Using CRUD operations
def crud_example():
    db = next(get_db())
    
    # Create a claim
    claim_data = ClaimCreate(
        policy_number="POL987654321",
        claimant_name="Jane Smith",
        estimated_damage=3500
    )
    claim = claim_crud.create(db=db, claim_data=claim_data)
    
    # Add a document to the claim
    doc_data = DocumentCreate(
        claim_id=claim.id,
        filename="photo1.jpg",
        file_path="/uploads/photo1.jpg",
        file_type="image/jpeg",
        file_size=1024000
    )
    document = document_crud.create(db=db, document_data=doc_data)
    
    # Get claim with all related data
    full_claim = claim_crud.get(db=db, claim_id=claim.id)
    print(f"Claim {full_claim.id} has {len(full_claim.documents)} documents")
```

### 4. FastAPI Integration

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import get_db
from models.schemas import ClaimCreate, ClaimResponse
from models.crud import claim_crud

app = FastAPI()

@app.post("/claims/", response_model=ClaimResponse)
def create_claim(claim: ClaimCreate, db: Session = Depends(get_db)):
    return claim_crud.create(db=db, claim_data=claim)

@app.get("/claims/{claim_id}", response_model=ClaimResponse)
def get_claim(claim_id: int, db: Session = Depends(get_db)):
    return claim_crud.get(db=db, claim_id=claim_id)
```

## Model Relationships

The models have the following relationships:

```
Claim (1) ←→ (many) Document
Claim (1) ←→ (many) Inconsistency
```

- Each **Claim** can have multiple **Documents** (photos, forms, etc.)
- Each **Claim** can have multiple **Inconsistencies** (data validation issues)
- **Documents** and **Inconsistencies** belong to exactly one **Claim**

## Model Features

### Claim Model
- Complete insurance claim information
- Vehicle and driver details
- Incident information and damage assessment
- Status tracking and timestamps
- Calculated properties (e.g., `full_vehicle_info`, `is_recent`)

### Document Model
- File metadata and storage information
- OCR/AI extracted data storage (JSON)
- File type detection and size tracking
- Helper methods for data manipulation

### Inconsistency Model
- Field-level data comparison
- Confidence scoring for AI/OCR results
- Severity classification (low, medium, high)
- Difference analysis methods

## Database Configuration

The models are configured to work with SQLite by default, but can be easily adapted for other databases:

```python
# For PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost/dbname"

# For MySQL
DATABASE_URL = "mysql+pymysql://user:password@localhost/dbname"
```

## API Schemas

Pydantic schemas provide:
- **Request validation** for incoming API data
- **Response serialization** for outgoing API data
- **Type hints** and documentation
- **Data transformation** and validation

Key schema types:
- `ClaimCreate`, `ClaimUpdate`, `ClaimResponse` - For claim operations
- `DocumentCreate`, `DocumentResponse` - For document operations
- `InconsistencyCreate`, `InconsistencyResponse` - For inconsistency tracking

## CRUD Operations

The CRUD module provides convenient database operations:

- **Create** - Add new records
- **Read** - Query and filter records
- **Update** - Modify existing records
- **Delete** - Remove records
- **Statistics** - Aggregate data and reports

## Example API Endpoints

The `example_api.py` file demonstrates a complete FastAPI application with:

- ✅ Claim management (CRUD operations)
- ✅ Document upload and management
- ✅ Inconsistency tracking
- ✅ Statistics and reporting
- ✅ Error handling and validation
- ✅ Proper HTTP status codes

## Development Tips

1. **Always use the `get_db()` dependency** for database sessions in FastAPI
2. **Use CRUD operations** instead of direct SQLAlchemy queries for consistency
3. **Validate data with Pydantic schemas** before database operations
4. **Handle database exceptions** properly in your API endpoints
5. **Use transactions** for operations that affect multiple tables

## Testing

For testing, you can create a test database:

```python
from models.database import Base, engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Create test database
test_engine = create_engine("sqlite:///test.db")
TestSessionLocal = sessionmaker(bind=test_engine)
Base.metadata.create_all(bind=test_engine)
```

This models package provides a solid foundation for building the Auto Insurance claim intake system with proper data modeling, validation, and API integration.

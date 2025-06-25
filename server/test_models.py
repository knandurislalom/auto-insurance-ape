#!/usr/bin/env python3
"""
Test script to verify that the SQLAlchemy models work correctly.
"""

import sys
import os

# Add the server directory to Python path
sys.path.append(os.path.dirname(__file__))

try:
    # Import our models
    from models import Base, engine, SessionLocal, create_tables, Claim, Document, Inconsistency
    from models.schemas import ClaimCreate, DocumentCreate, InconsistencyCreate
    from models.crud import claim_crud, document_crud, inconsistency_crud
    
    print("✅ Successfully imported all models and dependencies!")
    
    # Test database connection
    print("\n📊 Testing database connection...")
    
    # Create tables
    create_tables()
    print("✅ Database tables created successfully!")
    
    # Test creating a session
    db = SessionLocal()
    print("✅ Database session created successfully!")
    
    # Test creating a claim
    print("\n🔍 Testing claim creation...")
    claim_data = ClaimCreate(
        policy_number="TEST123456789",
        claimant_name="Test User",
        vehicle_make="Test",
        vehicle_model="Model",
        vehicle_year=2023,
        estimated_damage=1000,
        incident_date="2024-12-24",
        incident_location="Test Location"
    )
    
    # Create claim using CRUD
    claim = claim_crud.create(db=db, claim_data=claim_data)
    print(f"✅ Created claim with ID: {claim.id}")
    print(f"   Policy: {claim.policy_number}")
    print(f"   Claimant: {claim.claimant_name}")
    print(f"   Vehicle: {claim.vehicle_year} {claim.vehicle_make} {claim.vehicle_model}")
    print(f"   Damage: ${claim.estimated_damage}")
    
    # Test creating a document
    print("\n📄 Testing document creation...")
    doc_data = DocumentCreate(
        claim_id=claim.id,
        filename="test_document.pdf",
        file_path="/test/path/test_document.pdf",
        file_type="application/pdf",
        file_size=102400,
        extracted_data={"test_field": "test_value"}
    )
    
    document = document_crud.create(db=db, document_data=doc_data)
    print(f"✅ Created document with ID: {document.id}")
    print(f"   Filename: {document.filename}")
    print(f"   Size: {document.file_size_mb} MB")
    print(f"   Type: {document.file_type}")
    print(f"   Is PDF: {document.is_pdf}")
    
    # Test creating an inconsistency
    print("\n⚠️  Testing inconsistency creation...")
    inc_data = InconsistencyCreate(
        claim_id=claim.id,
        field_name="driver_license",
        form_value="DL123456789",
        extracted_value="DL123456789",
        confidence_score=0.95
    )
    
    inconsistency = inconsistency_crud.create(db=db, inconsistency_data=inc_data)
    print(f"✅ Created inconsistency with ID: {inconsistency.id}")
    print(f"   Field: {inconsistency.field_name}")
    print(f"   Confidence: {inconsistency.confidence_score}")
    print(f"   Severity: {inconsistency.severity}")
    print(f"   Is Significant: {inconsistency.is_significant}")
    
    # Test reading data back
    print("\n📖 Testing data retrieval...")
    
    # Get claim with relationships
    full_claim = claim_crud.get(db=db, claim_id=claim.id)
    print(f"✅ Retrieved claim {full_claim.id}")
    print(f"   Documents: {len(full_claim.documents)}")
    print(f"   Inconsistencies: {len(full_claim.inconsistencies)}")
    
    # Test claim properties
    print(f"   Full vehicle info: {full_claim.full_vehicle_info}")
    print(f"   Is recent: {full_claim.is_recent}")
    
    # Test statistics
    print("\n📈 Testing statistics...")
    stats = claim_crud.get_statistics(db=db)
    print(f"✅ Statistics calculated:")
    for key, value in stats.items():
        print(f"   {key}: {value}")
    
    # Test conversion to dict
    print("\n🔄 Testing serialization...")
    claim_dict = full_claim.to_dict()
    print(f"✅ Claim serialized to dict with {len(claim_dict)} fields")
    
    doc_dict = document.to_dict()
    print(f"✅ Document serialized to dict with {len(doc_dict)} fields")
    
    inc_dict = inconsistency.to_dict()
    print(f"✅ Inconsistency serialized to dict with {len(inc_dict)} fields")
    
    print("\n🎉 ALL TESTS PASSED! 🎉")
    print("The SQLAlchemy models are working correctly!")
    
    # Clean up
    db.close()
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you have installed the required packages:")
    print("pip install fastapi sqlalchemy pydantic uvicorn python-multipart")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    
    if 'db' in locals():
        db.close()

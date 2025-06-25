#!/usr/bin/env python3
"""
Add sample data to the server's SQLAlchemy database.
"""
import sys
import os
from datetime import datetime

# Add the server directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.database import SessionLocal
from models.claim import Claim
from models.document import Document
from models.inconsistency import Inconsistency

def add_sample_data():
    """Add sample claims, documents, and inconsistencies."""
    db = SessionLocal()
    
    try:
        # Sample claim 1
        claim1 = Claim(
            policy_number="POL-123456789",
            claimant_name="Sarah Johnson",
            vehicle_make="Toyota",
            vehicle_model="Camry",
            vehicle_year=2022,
            vehicle_vin="1HGBH41JXMN109186",
            driver_present=True,
            driver_name="Sarah Johnson",
            driver_license="DL123456789",
            incident_date=datetime(2024, 12, 20),
            incident_time="14:30",
            incident_location="123 Main St, Seattle, WA 98101",
            weather_conditions="Clear",
            damage_description="Rear-end collision, damage to rear bumper and trunk",
            estimated_damage=2500,
            injuries_reported=False,
            status="submitted"
        )
        
        # Sample claim 2 - collision claim
        claim2 = Claim(
            policy_number="POL-987654321",
            claimant_name="Mike Chen",
            vehicle_make="Honda",
            vehicle_model="Civic",
            vehicle_year=2021,
            vehicle_vin="2HGFC2F59MH123456",
            driver_present=True,
            driver_name="Mike Chen",
            driver_license="DL987654321",
            incident_date=datetime(2024, 12, 22),
            incident_time="09:15",
            incident_location="456 Oak Ave, Portland, OR 97201",
            weather_conditions="Rainy",
            damage_description="Side-impact collision at intersection, damage to left side door and fender",
            estimated_damage=4200,
            injuries_reported=False,
            status="under_review"
        )
        
        # Add claims to session
        db.add(claim1)
        db.add(claim2)
        db.flush()  # Flush to get IDs
        
        # Sample documents
        doc1 = Document(
            claim_id=claim1.id,
            filename="driver_license_sarah.jpg",
            file_path="/uploads/driver_license_sarah.jpg",
            file_type="image/jpeg",
            file_size=245760,
            extracted_data='{"license_number": "DL123456789", "name": "Sarah Johnson", "expiry": "2025-12-31"}'
        )
        
        doc2 = Document(
            claim_id=claim1.id,
            filename="damage_photo_1.jpg",
            file_path="/uploads/damage_photo_1.jpg",
            file_type="image/jpeg",
            file_size=512000,
            extracted_data='{"damage_type": "rear_end", "severity": "moderate"}'
        )
        
        doc3 = Document(
            claim_id=claim2.id,
            filename="police_report.pdf",
            file_path="/uploads/police_report.pdf",
            file_type="application/pdf",
            file_size=128000,
            extracted_data='{"report_number": "PR-2024-12-22-001", "officer": "Officer Johnson"}'
        )
        
        # Add documents to session
        db.add(doc1)
        db.add(doc2)
        db.add(doc3)
        
        # Sample inconsistency
        inconsistency1 = Inconsistency(
            claim_id=claim1.id,
            field_name="driver_license",
            form_value="DL123456789",
            extracted_value="DL123456789",
            confidence_score=0.98
        )
        
        db.add(inconsistency1)
        
        # Commit all changes
        db.commit()
        
        print("✅ Sample data added successfully!")
        print(f"Added claims: {claim1.id}, {claim2.id}")
        print(f"Added {3} documents")
        print(f"Added {1} inconsistency record")
        
        # Verify data
        claims_count = db.query(Claim).count()
        docs_count = db.query(Document).count()
        inconsistencies_count = db.query(Inconsistency).count()
        
        print(f"\nDatabase summary:")
        print(f"  Total claims: {claims_count}")
        print(f"  Total documents: {docs_count}")
        print(f"  Total inconsistencies: {inconsistencies_count}")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        db.rollback()
        return 1
    finally:
        db.close()
    
    return 0

if __name__ == "__main__":
    print("Adding sample data to auto insurance database...")
    print("-" * 50)
    exit(add_sample_data())

#!/usr/bin/env python3
"""
Example script demonstrating how to use the Auto Insurance database.
Shows common operations like inserting claims, documents, and querying data.
"""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from config import get_db_connection, get_database_info
import json

def create_new_claim(policy_number, claimant_name, vehicle_info, incident_info):
    """Create a new insurance claim."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO claims (
                policy_number, claimant_name, vehicle_make, vehicle_model, 
                vehicle_year, vehicle_vin, driver_present, driver_name, 
                driver_license, incident_date, incident_time, incident_location,
                weather_conditions, damage_description, estimated_damage, 
                injuries_reported, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            policy_number,
            claimant_name,
            vehicle_info.get('make'),
            vehicle_info.get('model'),
            vehicle_info.get('year'),
            vehicle_info.get('vin'),
            incident_info.get('driver_present', True),
            incident_info.get('driver_name'),
            incident_info.get('driver_license'),
            incident_info.get('date'),
            incident_info.get('time'),
            incident_info.get('location'),
            incident_info.get('weather'),
            incident_info.get('description'),
            incident_info.get('estimated_damage', 0),
            incident_info.get('injuries_reported', False),
            'pending'
        ))
        
        claim_id = cursor.lastrowid
        conn.commit()
        
        print(f"Created new claim with ID: {claim_id}")
        return claim_id

def add_document_to_claim(claim_id, filename, file_path, file_type, extracted_data=None):
    """Add a document to an existing claim."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get file size if file exists
        file_size = os.path.getsize(file_path) if os.path.exists(file_path) else 0
        
        cursor.execute("""
            INSERT INTO documents (
                claim_id, filename, file_path, file_type, file_size, extracted_data
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            claim_id,
            filename,
            file_path,
            file_type,
            file_size,
            json.dumps(extracted_data) if extracted_data else None
        ))
        
        doc_id = cursor.lastrowid
        conn.commit()
        
        print(f"Added document with ID: {doc_id} to claim {claim_id}")
        return doc_id

def get_claims_by_status(status='pending'):
    """Get all claims with a specific status."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, policy_number, claimant_name, vehicle_make, vehicle_model,
                   incident_date, estimated_damage, status, submission_date
            FROM claims 
            WHERE status = ?
            ORDER BY submission_date DESC
        """, (status,))
        
        claims = cursor.fetchall()
        return [dict(claim) for claim in claims]

def get_claim_with_documents(claim_id):
    """Get a claim with all its associated documents."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get claim details
        cursor.execute("SELECT * FROM claims WHERE id = ?", (claim_id,))
        claim = cursor.fetchone()
        
        if not claim:
            return None
        
        # Get associated documents
        cursor.execute("SELECT * FROM documents WHERE claim_id = ?", (claim_id,))
        documents = cursor.fetchall()
        
        # Get inconsistencies
        cursor.execute("SELECT * FROM inconsistencies WHERE claim_id = ?", (claim_id,))
        inconsistencies = cursor.fetchall()
        
        return {
            'claim': dict(claim),
            'documents': [dict(doc) for doc in documents],
            'inconsistencies': [dict(inc) for inc in inconsistencies]
        }

def update_claim_status(claim_id, new_status):
    """Update the status of a claim."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE claims 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        """, (new_status, claim_id))
        
        if cursor.rowcount > 0:
            conn.commit()
            print(f"Updated claim {claim_id} status to: {new_status}")
            return True
        else:
            print(f"Claim {claim_id} not found")
            return False

def main():
    """Demonstration of database operations."""
    print("=== Auto Insurance Database Demo ===")
    print()
    
    # Show database info
    db_info = get_database_info()
    print("Database Information:")
    print(f"  Path: {db_info['path']}")
    print(f"  Size: {db_info['size_bytes']} bytes")
    print(f"  Tables: {', '.join(db_info['tables'])}")
    print(f"  Record counts: {db_info['record_counts']}")
    print()
    
    # Create a new claim
    print("Creating a new claim...")
    vehicle_info = {
        'make': 'Honda',
        'model': 'Civic',
        'year': 2022,
        'vin': '2HGFC2F59MH123456'
    }
    
    incident_info = {
        'driver_present': True,
        'driver_name': 'Jane Smith',
        'driver_license': 'DL987654321',
        'date': '2024-12-24',
        'time': '10:15',
        'location': '456 Oak Avenue, Springfield, IL 62701',
        'weather': 'Rainy',
        'description': 'Side impact collision at intersection',
        'estimated_damage': 3500,
        'injuries_reported': False
    }
    
    claim_id = create_new_claim(
        policy_number="POL987654321",
        claimant_name="Jane Smith",
        vehicle_info=vehicle_info,
        incident_info=incident_info
    )
    print()
    
    # Add a document to the claim
    print("Adding document to claim...")
    add_document_to_claim(
        claim_id=claim_id,
        filename="accident_photos.zip",
        file_path="/uploads/accident_photos.zip",
        file_type="application/zip",
        extracted_data={"photo_count": 5, "damage_areas": ["front_bumper", "driver_door"]}
    )
    print()
    
    # Get pending claims
    print("Pending claims:")
    pending_claims = get_claims_by_status('pending')
    for claim in pending_claims:
        print(f"  - Claim {claim['id']}: {claim['claimant_name']} - ${claim['estimated_damage']}")
    print()
    
    # Get full claim details
    print(f"Full details for claim {claim_id}:")
    full_claim = get_claim_with_documents(claim_id)
    if full_claim:
        claim = full_claim['claim']
        print(f"  Claimant: {claim['claimant_name']}")
        print(f"  Vehicle: {claim['vehicle_year']} {claim['vehicle_make']} {claim['vehicle_model']}")
        print(f"  Incident: {claim['incident_date']} at {claim['incident_location']}")
        print(f"  Damage: ${claim['estimated_damage']}")
        print(f"  Documents: {len(full_claim['documents'])}")
        print(f"  Inconsistencies: {len(full_claim['inconsistencies'])}")
    print()
    
    # Update claim status
    print("Updating claim status...")
    update_claim_status(claim_id, 'under_review')
    print()
    
    print("Demo completed successfully!")

if __name__ == "__main__":
    main()

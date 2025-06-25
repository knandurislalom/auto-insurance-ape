#!/usr/bin/env python3
"""
SQLite Database Setup Script for Auto Insurance Claim System
Creates the database and all required tables based on the schema.
"""

import sqlite3
import os

def create_database(database_path):
    """Create SQLite database and tables."""
    
    # Remove existing database if it exists
    if os.path.exists(database_path):
        os.remove(database_path)
        print(f"Removed existing database: {database_path}")
    
    # Create connection to SQLite database
    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()
    
    try:
        # Enable foreign key constraints
        cursor.execute("PRAGMA foreign_keys = ON")
        
        # Create claims table
        cursor.execute("""
        CREATE TABLE claims (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            policy_number TEXT NOT NULL,
            claimant_name TEXT NOT NULL,
            vehicle_make TEXT,
            vehicle_model TEXT,
            vehicle_year INTEGER,
            vehicle_vin TEXT,
            driver_present BOOLEAN,
            driver_name TEXT,
            driver_license TEXT,
            incident_date TEXT,
            incident_time TEXT,
            incident_location TEXT,
            weather_conditions TEXT,
            damage_description TEXT,
            estimated_damage INTEGER NOT NULL,
            injuries_reported BOOLEAN,
            submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending'
        )
        """)
        
        # Create documents table
        cursor.execute("""
        CREATE TABLE documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            claim_id INTEGER,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_type TEXT,
            file_size INTEGER,
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            extracted_data TEXT,
            FOREIGN KEY (claim_id) REFERENCES claims (id)
        )
        """)
        
        # Create inconsistencies table
        cursor.execute("""
        CREATE TABLE inconsistencies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            claim_id INTEGER,
            field_name TEXT,
            form_value TEXT,
            extracted_value TEXT,
            confidence_score REAL,
            FOREIGN KEY (claim_id) REFERENCES claims (id)
        )
        """)
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX idx_claims_policy_number ON claims(policy_number)")
        cursor.execute("CREATE INDEX idx_claims_status ON claims(status)")
        cursor.execute("CREATE INDEX idx_claims_submission_date ON claims(submission_date)")
        cursor.execute("CREATE INDEX idx_documents_claim_id ON documents(claim_id)")
        cursor.execute("CREATE INDEX idx_inconsistencies_claim_id ON inconsistencies(claim_id)")
        
        # Commit the changes
        conn.commit()
        
        print(f"Database created successfully: {database_path}")
        print("Tables created:")
        print("- claims")
        print("- documents")
        print("- inconsistencies")
        print("- Indexes created for optimal performance")
        
        # Display table schemas
        print("\n" + "="*50)
        print("TABLE SCHEMAS:")
        print("="*50)
        
        tables = ['claims', 'documents', 'inconsistencies']
        for table in tables:
            print(f"\n{table.upper()} table structure:")
            cursor.execute(f"PRAGMA table_info({table})")
            columns = cursor.fetchall()
            for column in columns:
                print(f"  {column[1]} ({column[2]}) {'PRIMARY KEY' if column[5] else ''} {'NOT NULL' if column[3] else ''}")
        
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
        conn.rollback()
    
    finally:
        conn.close()

def insert_sample_data(database_path):
    """Insert some sample data for testing."""
    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()
    
    try:
        # Insert sample claim
        cursor.execute("""
        INSERT INTO claims (
            policy_number, claimant_name, vehicle_make, vehicle_model, 
            vehicle_year, vehicle_vin, driver_present, driver_name, 
            driver_license, incident_date, incident_time, incident_location,
            weather_conditions, damage_description, estimated_damage, 
            injuries_reported, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            "POL123456789",
            "John Doe",
            "Toyota",
            "Camry",
            2020,
            "1HGBH41JXMN109186",
            True,
            "John Doe",
            "DL123456789",
            "2024-12-20",
            "14:30",
            "123 Main St, Anytown, ST 12345",
            "Clear",
            "Rear-end collision, damage to rear bumper and trunk",
            2500,
            False,
            "submitted"
        ))
        
        claim_id = cursor.lastrowid
        
        # Insert sample document
        cursor.execute("""
        INSERT INTO documents (
            claim_id, filename, file_path, file_type, file_size, extracted_data
        ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            claim_id,
            "driver_license.jpg",
            "/uploads/driver_license.jpg",
            "image/jpeg",
            245760,
            '{"license_number": "DL123456789", "name": "John Doe", "expiry": "2025-12-31"}'
        ))
        
        # Insert sample inconsistency
        cursor.execute("""
        INSERT INTO inconsistencies (
            claim_id, field_name, form_value, extracted_value, confidence_score
        ) VALUES (?, ?, ?, ?, ?)
        """, (
            claim_id,
            "driver_license",
            "DL123456789",
            "DL123456789",
            0.98
        ))
        
        conn.commit()
        print("\nSample data inserted successfully!")
        
        # Display inserted data
        print("\nSample claim data:")
        cursor.execute("SELECT * FROM claims WHERE id = ?", (claim_id,))
        claim = cursor.fetchone()
        print(f"  Claim ID: {claim[0]}")
        print(f"  Policy: {claim[1]}")
        print(f"  Claimant: {claim[2]}")
        print(f"  Vehicle: {claim[5]} {claim[3]} {claim[4]}")
        print(f"  Status: {claim[18]}")
        
    except sqlite3.Error as e:
        print(f"Error inserting sample data: {e}")
        conn.rollback()
    
    finally:
        conn.close()

if __name__ == "__main__":
    # Database file path
    db_path = os.path.join(os.path.dirname(__file__), "auto_insurance.db")
    
    print("Creating Auto Insurance SQLite Database...")
    print(f"Database location: {db_path}")
    print("-" * 50)
    
    # Create database and tables
    create_database(db_path)
    
    # Insert sample data
    insert_sample_data(db_path)
    
    print("\n" + "="*50)
    print("Database setup complete!")
    print(f"Database file: {db_path}")
    print("="*50)

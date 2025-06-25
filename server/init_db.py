#!/usr/bin/env python3
"""
Initialize SQLAlchemy database tables for the Auto Insurance server.
"""
import sys
import os

# Add the server directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.database import create_tables, engine
from models.claim import Claim
from models.document import Document
from models.inconsistency import Inconsistency

def main():
    """Create all database tables."""
    print("Creating SQLAlchemy database tables...")
    print(f"Database: {engine.url}")
    print("-" * 50)
    
    try:
        # Create all tables
        create_tables()
        print("✅ Database tables created successfully!")
        
        # Print created tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        table_names = inspector.get_table_names()
        
        print("\nCreated tables:")
        for table_name in table_names:
            print(f"  - {table_name}")
            
        print(f"\nDatabase file location: {str(engine.url).replace('sqlite:///', '')}")
        
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

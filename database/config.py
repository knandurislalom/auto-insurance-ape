"""
Database configuration and connection utilities for Auto Insurance system.
"""

import sqlite3
import os
from contextlib import contextmanager
from typing import Generator

# Database file path
DB_PATH = os.path.join(os.path.dirname(__file__), "auto_insurance.db")

@contextmanager
def get_db_connection() -> Generator[sqlite3.Connection, None, None]:
    """
    Context manager for database connections.
    Ensures proper connection cleanup and transaction handling.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    conn.execute("PRAGMA foreign_keys = ON")  # Enable foreign key constraints
    
    try:
        yield conn
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def get_db_cursor() -> sqlite3.Cursor:
    """
    Get a database cursor for simple queries.
    Note: Remember to close the connection when done.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn.cursor()

def init_database():
    """Initialize the database by running the create_database script."""
    import create_database
    create_database.create_database(DB_PATH)
    create_database.insert_sample_data(DB_PATH)

def check_database_exists() -> bool:
    """Check if the database file exists."""
    return os.path.exists(DB_PATH)

def get_database_info() -> dict:
    """Get information about the database."""
    if not check_database_exists():
        return {"exists": False}
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get table names
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        # Get record counts for each table
        table_counts = {}
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            table_counts[table] = cursor.fetchone()[0]
        
        # Get database file size
        file_size = os.path.getsize(DB_PATH)
        
        return {
            "exists": True,
            "path": DB_PATH,
            "size_bytes": file_size,
            "tables": tables,
            "record_counts": table_counts
        }

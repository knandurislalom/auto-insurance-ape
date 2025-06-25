"""
Auto Insurance Database Package

This package contains the database setup, configuration, and utilities
for the Auto Insurance claim intake system.

Modules:
- create_database: Script to create and initialize the SQLite database
- config: Database configuration and connection utilities
"""

from .config import get_db_connection, check_database_exists, get_database_info, init_database

__version__ = "1.0.0"
__all__ = ["get_db_connection", "check_database_exists", "get_database_info", "init_database"]

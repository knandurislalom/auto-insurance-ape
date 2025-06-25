# Database Documentation

This directory contains the SQLite database and related utilities for the Auto Insurance Claim Intake system.

## Files

- `auto_insurance.db` - SQLite database file (created when running create_database.py)
- `create_database.py` - Script to create and initialize the database
- `config.py` - Database configuration and connection utilities
- `__init__.py` - Package initialization file

## Database Schema

The database contains three main tables:

### Claims Table
Stores insurance claim information including:
- Policy and claimant details
- Vehicle information (make, model, year, VIN)
- Driver information
- Incident details (date, time, location, weather)
- Damage description and estimated cost
- Injury reporting
- Claim status tracking

### Documents Table
Stores uploaded documents and files related to claims:
- Document metadata (filename, path, type, size)
- OCR extracted data (stored as JSON)
- Upload timestamps
- Links to parent claims

### Inconsistencies Table
Tracks differences between form data and extracted document data:
- Field-level comparison results
- Confidence scores from OCR/AI analysis
- Form vs. extracted values
- Links to parent claims

## Usage

### Create Database
```bash
# Run from the database directory
python create_database.py
```

### Use in Python Code
```python
from database import get_db_connection, check_database_exists

# Check if database exists
if check_database_exists():
    # Use database connection
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM claims")
        claims = cursor.fetchall()
```

### Initialize Database Programmatically
```python
from database import init_database

# Create database and insert sample data
init_database()
```

## Database Tools

You can use various tools to view and manage the SQLite database:

- **DB Browser for SQLite** (Recommended GUI tool)
- **SQLiteStudio** (Cross-platform GUI)
- **DBeaver** (Multi-database tool)
- **VS Code SQLite extensions**
- **Command line**: `sqlite3 auto_insurance.db`

## Sample Data

The database creation script includes sample data for testing:
- One sample insurance claim
- Associated document record
- Inconsistency tracking record

This data helps verify the database setup and provides examples for development and testing.

## Security Notes

- The database file should not be committed to version control in production
- Consider encryption for sensitive production data
- Implement proper backup strategies for production databases
- Use environment variables for database paths in production

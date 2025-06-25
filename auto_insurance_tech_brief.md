# Auto Insurance Intake POC - Technical Brief

## Architecture Overview

**Frontend**: React.js with TypeScript for type safety and better developer experience
**Backend**: Python with FastAPI for high-performance API endpoints
**AI/OCR**: LangChain for intelligent document processing and data extraction
**Database**: SQLite for local development (easy setup, no external dependencies)
**Document Storage**: Local file system with FastAPI file uploads
**OCR**: Python-based OCR using Tesseract-OCR and OpenCV for advanced document processing
**Styling**: Material-UI (MUI) for professional, accessible component library
**State Management**: React Context API (sufficient for POC scope)

## Technology Stack Justification

- **React + TypeScript**: Provides excellent developer experience, type safety, and component reusability
- **Python/FastAPI**: Superior performance for AI/ML workloads, excellent async support, automatic API documentation
- **LangChain**: Advanced document processing, text extraction, and AI-powered data analysis
- **SQLite**: Zero-config database perfect for POC, easy to inspect data
- **Material-UI**: Enterprise-grade components, accessibility built-in, consistent design system
- **Python OCR Stack**: More accurate than browser-based OCR, supports advanced image preprocessing

## Project Structure
```
auto-insurance-poc/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable MUI components
│   │   ├── pages/          # Main pages (Intake, Dashboard)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Helper functions
│   │   └── types/          # TypeScript definitions
├── server/                 # Python FastAPI backend
│   ├── app/
│   │   ├── routers/        # API route handlers
│   │   ├── services/       # Business logic (OCR, LangChain)
│   │   ├── models/         # Database models (SQLAlchemy)
│   │   ├── schemas/        # Pydantic request/response models
│   │   └── core/           # Configuration and utilities
│   ├── uploads/            # File storage
│   └── requirements.txt    # Python dependencies
├── database/               # SQLite database files
└── docs/                   # Documentation
```

## Core Components

### 1. Smart Auto Claim Intake Form
**Components**:
- `ClaimIntakeForm.tsx` - Main form wrapper using MUI Form components
- `VehicleInfoSection.tsx` - Vehicle details with MUI TextField and Select
- `DriverSection.tsx` - Conditional driver information with MUI Checkbox
- `IncidentSection.tsx` - Incident details using MUI DatePicker and TextArea
- `DocumentUploadSection.tsx` - File upload with MUI Button and progress indicators

**Key Features**:
- Material-UI form components with consistent theming
- Real-time validation using react-hook-form + MUI integration
- MUI Stepper component for progress indication
- Responsive design with MUI Grid system
- Accessibility features built into MUI components

### 2. Document Upload & AI Extraction
**Components**:
- `FileUploader.tsx` - MUI dropzone with drag-and-drop interface
- `DocumentPreview.tsx` - MUI Card components for file previews
- `OCRProcessor.tsx` - LangChain integration for intelligent extraction
- `InconsistencyChecker.tsx` - AI-powered data validation and comparison

**API Endpoints** (FastAPI):
- `POST /api/upload` - Handle multipart file uploads
- `POST /api/ocr/extract` - LangChain OCR processing with AI enhancement
- `GET /api/documents/{claim_id}` - Retrieve claim documents
- `POST /api/ai/validate` - AI-powered data validation and extraction

**LangChain Integration**:
- Document loaders for various file formats (PDF, images, etc.)
- Text splitters for processing large documents
- Custom chains for extracting specific auto insurance information
- Vector embeddings for semantic search and comparison
- AI models for intelligent field mapping and validation

### 3. Processor Dashboard
**Components**:
- `ClaimsDashboard.tsx` - Main dashboard using MUI Container and Grid
- `ClaimsTable.tsx` - MUI DataGrid with sorting, filtering, and pagination
- `ClaimDetailModal.tsx` - MUI Modal with detailed claim information
- `StatusChip.tsx` - MUI Chip components for visual status indicators
- `FlagIndicator.tsx` - MUI Alert components for inconsistency warnings
- `MetricsCards.tsx` - MUI Card components displaying claim statistics

**MUI Features**:
- Material Design theming with custom color palette
- Dark/light mode toggle capability
- Responsive breakpoints for mobile optimization
- Built-in accessibility features (screen reader support, keyboard navigation)

## Database Schema

```sql
-- Claims table
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
    estimated_damage INT NOT NULL,
    injuries_reported BOOLEAN,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending'
);

-- Documents table
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id INTEGER,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    extracted_data TEXT, -- JSON string of OCR results
    FOREIGN KEY (claim_id) REFERENCES claims (id)
);

-- Inconsistencies table
CREATE TABLE inconsistencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id INTEGER,
    field_name TEXT,
    form_value TEXT,
    extracted_value TEXT,
    confidence_score REAL,
    FOREIGN KEY (claim_id) REFERENCES claims (id)
);
```

## API Design (FastAPI)

### Claims API
- `POST /api/claims/` - Submit new claim (Pydantic validation)
- `GET /api/claims/` - List all claims with query parameters for filtering/sorting
- `GET /api/claims/{claim_id}` - Get specific claim details
- `PUT /api/claims/{claim_id}/status` - Update claim status

### Documents API
- `POST /api/claims/{claim_id}/documents/` - Upload documents with file validation
- `GET /api/claims/{claim_id}/documents/` - Get claim documents
- `POST /api/documents/{document_id}/extract` - Trigger LangChain OCR extraction

### AI/LangChain API
- `POST /api/ai/extract-info` - Extract structured data using LangChain
- `POST /api/ai/validate-consistency` - AI-powered inconsistency detection
- `POST /api/ai/classify-document` - Automatically classify document types

### Validation API
- `POST /api/validate/vin` - Validate VIN format and lookup vehicle details
- `POST /api/validate/license` - Validate driver's license format
- `GET /api/validate/inconsistencies/{claim_id}` - Get AI-detected inconsistencies

## Implementation Timeline (24 hours)

### Hours 1-3: Project Setup & Basic Structure
- Initialize React + TypeScript project with MUI
- Set up Python FastAPI server with virtual environment
- Configure SQLite database with SQLAlchemy ORM
- Install LangChain and OCR dependencies (tesseract, opencv-python)
- Create basic project structure and development environment

### Hours 4-8: Smart Intake Form with MUI
- Build form components using MUI form elements
- Implement conditional driver section with MUI Checkbox and Collapse
- Add real-time validation with react-hook-form + MUI integration
- Create MUI Stepper component for progress indication
- Apply Material Design theming and responsive layout

### Hours 9-12: Document Upload & LangChain Integration
- Implement FastAPI file upload endpoints with validation
- Create MUI dropzone interface with progress indicators
- Set up LangChain document loaders and text extractors
- Integrate Python OCR with preprocessing (OpenCV)
- Build AI chains for extracting auto insurance specific data

### Hours 13-16: Processor Dashboard with MUI DataGrid
- Build claims listing using MUI DataGrid component
- Implement advanced filtering and sorting capabilities
- Create MUI Modal for detailed claim views
- Add MUI Chip components for status indicators and flags
- Implement dashboard metrics with MUI Cards

### Hours 17-20: AI Integration & Advanced OCR
- Connect LangChain to document processing pipeline
- Implement AI-powered inconsistency detection
- Build semantic search for document classification
- Create custom LangChain chains for auto insurance data extraction
- Test AI accuracy and fine-tune prompts

### Hours 21-24: Polish & Demo Preparation
- Add comprehensive error handling and MUI Snackbar notifications
- Implement MUI theming with dark/light mode toggle
- Create sample data and realistic demo scenarios
- Test complete user flow with various document types
- Prepare demo script showcasing AI capabilities

## Key Technical Decisions

**Why FastAPI over Express?** 
- Superior performance for AI/ML workloads
- Automatic API documentation with OpenAPI/Swagger
- Built-in data validation with Pydantic
- Excellent async/await support for OCR processing
- Better integration with Python ML ecosystem

**Why LangChain?**
- Advanced document processing capabilities
- Semantic understanding of insurance terminology
- Extensible chain architecture for complex workflows
- Built-in support for various LLMs and embedding models
- Vector database integration for similarity search

**Why Material-UI over Tailwind?**
- Enterprise-grade component library with consistent design system
- Built-in accessibility features (WCAG compliance)
- Advanced components like DataGrid, DatePicker out of the box
- Theming system with dark/light mode support
- Better suited for complex dashboard interfaces

**Why Python OCR Stack?**
- More accurate text extraction with preprocessing capabilities
- OpenCV integration for image enhancement
- Better handling of poor quality scanned documents
- Server-side processing allows for larger, more complex documents

**Why React Hook Form + MUI?**
- Excellent performance with minimal re-renders
- Seamless integration with MUI form components
- Built-in validation with TypeScript support
- Handles complex conditional form logic elegantly

## Security Considerations (POC Level)

- Input sanitization with Pydantic models and FastAPI validation
- File type validation and size limits on uploads
- CORS configuration for secure cross-origin requests
- Basic XSS prevention with MUI's built-in sanitization
- Environment variable management for sensitive configurations
- Rate limiting on OCR and AI endpoints to prevent abuse

*Note: Full production security audit would be required for real deployment*

## Performance Targets

- Initial page load: <2 seconds (MUI components are optimized)
- Form submission: <1 second (FastAPI performance)
- File upload: <5 seconds for 10MB files
- OCR + AI processing: <15 seconds per document (LangChain processing time)
- Dashboard refresh: <500ms (MUI DataGrid virtualization)
- AI inconsistency detection: <3 seconds per claim

## Success Criteria

✅ **Intake Form**: Users can complete full claim submission using intuitive MUI components
✅ **File Upload**: Multiple document types accepted with MUI progress indicators and previews
✅ **AI-Powered OCR**: LangChain extracts structured auto insurance data from documents
✅ **Smart Inconsistency Detection**: AI identifies data mismatches and potential fraud indicators
✅ **Advanced Dashboard**: Processors can efficiently manage claims using MUI DataGrid with filtering/sorting
✅ **Responsive Design**: Professional Material Design interface works on all devices
✅ **AI Intelligence**: System demonstrates understanding of insurance terminology and context

## Deployment Strategy

For POC demo:
- Frontend: React build served by FastAPI static files
- Backend: Single Python FastAPI process with uvicorn
- Database: SQLite file in project directory
- Files: Local storage in uploads folder
- AI Models: Local embeddings and processing (no external API dependencies)

## LangChain Architecture

**Document Processing Pipeline**:
1. **Document Loaders**: Handle PDF, images, and text files
2. **Text Splitters**: Chunk large documents for processing
3. **Embeddings**: Create vector representations for semantic search
4. **Custom Chains**: Extract specific auto insurance fields
5. **Memory**: Maintain context across document analysis
6. **Output Parsers**: Structure extracted data into JSON format

**AI Capabilities**:
- Automatic document classification (police report, insurance card, etc.)
- Intelligent field extraction with confidence scoring
- Semantic similarity detection for inconsistency checking
- Natural language understanding of incident descriptions

## Next Steps (Post-POC)

1. **Production Architecture**: Containerized deployment with Docker
2. **Database Migration**: Move to PostgreSQL with vector extensions for embeddings
3. **Cloud Storage**: Implement cloud storage (AWS S3, etc.) with CDN
4. **Authentication**: Add user management with OAuth2/JWT tokens
5. **Advanced AI**: Integrate larger language models (GPT-4, Claude) for enhanced understanding
6. **Fraud Detection**: Implement ML models for risk scoring and fraud detection
7. **Integration**: Connect with existing insurance systems and APIs
8. **Monitoring**: Add comprehensive logging, metrics, and AI model performance tracking
9. **Scalability**: Implement horizontal scaling with message queues for document processing
10. **Compliance**: Add audit trails and data protection features for regulatory compliance
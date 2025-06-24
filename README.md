# Auto Insurance Claims Processor - Proof of Concept

A full-stack application for processing auto insurance claims with AI-powered OCR capabilities using LangChain.

## Project Structure

```
auto-insurance-poc/
├── client/          # React TypeScript frontend with Material-UI
├── server/          # Python FastAPI backend with LangChain
├── database/        # SQLite database files
├── docs/           # Documentation
└── package.json    # Root package with scripts
```

## Features

- **Frontend**: React with TypeScript, Material-UI (MUI) for professional UI components
- **Backend**: Python FastAPI with high-performance async capabilities
- **AI/OCR**: LangChain for intelligent document processing and data extraction
- **Database**: SQLite for local development
- **Document Processing**: Python-based OCR with OpenCV preprocessing for enhanced accuracy
- **Security**: Pydantic validation, CORS protection, file type validation

## Technology Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for component library
- React Hook Form for form management
- Responsive design with MUI Grid system

### Backend
- Python FastAPI for high-performance API
- LangChain for AI-powered document processing
- SQLAlchemy ORM for database operations
- Pydantic for data validation
- Python Tesseract + OpenCV for advanced OCR

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. Clone the repository
2. Install root dependencies:
   ```bash
   npm install
   ```

3. Set up the Python backend:
   ```bash
   npm run server:setup
   ```

4. Install client dependencies:
   ```bash
   cd client && npm install
   ```

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8000
- API docs available at http://localhost:8000/docs

### Individual Services

Run only the backend:
```bash
npm run server:dev
```

Run only the frontend:
```bash
npm run client:dev
```

### Production

Build the frontend:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Available Scripts

- `npm run dev` - Run both client and server in development mode
- `npm run client:dev` - Run only the React development server
- `npm run server:dev` - Run only the FastAPI development server
- `npm run server:setup` - Set up Python virtual environment and dependencies
- `npm run build` - Build the React app for production
- `npm start` - Start the production server

## API Documentation

When running the server, visit http://localhost:8000/docs for interactive API documentation powered by FastAPI and OpenAPI.

## AI Features

- **Intelligent OCR**: LangChain-powered text extraction with context understanding
- **Document Classification**: Automatic identification of document types
- **Data Validation**: AI-powered inconsistency detection between form data and documents
- **Semantic Search**: Vector-based document search and comparison

## Next Steps

1. Set up the Python virtual environment using `npm run server:setup`
2. Configure database connection and run migrations
3. Implement the LangChain document processing chains
4. Create the MUI-based claim submission forms
5. Add authentication and authorization
6. Deploy to your preferred hosting platform

## Development Notes

- The Python backend uses FastAPI with automatic API documentation
- LangChain integration allows for sophisticated document analysis
- Material-UI provides enterprise-grade components with built-in accessibility
- The project is structured for easy scaling and production deployment
>>>>>>> 0121dff (Initial commit: Auto Insurance Claims Processor POC)

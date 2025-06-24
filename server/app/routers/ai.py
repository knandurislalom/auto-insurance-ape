from fastapi import APIRouter

router = APIRouter()

@router.post("/extract-info")
async def extract_insurance_info():
    """Use LangChain to extract structured insurance data from documents"""
    return {"message": "AI extract info endpoint - to be implemented"}

@router.post("/validate-consistency")
async def validate_data_consistency():
    """AI-powered inconsistency detection between form data and documents"""
    return {"message": "AI validation endpoint - to be implemented"}

@router.post("/classify-document")
async def classify_document():
    """Automatically classify document types using AI"""
    return {"message": "AI document classification endpoint - to be implemented"}

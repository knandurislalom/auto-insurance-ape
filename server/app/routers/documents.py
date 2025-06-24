from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document for OCR processing"""
    return {"message": "Document upload endpoint - to be implemented"}

@router.get("/{claim_id}")
async def get_claim_documents(claim_id: int):
    """Get all documents for a specific claim"""
    return {"message": f"Get documents for claim {claim_id} - to be implemented"}

@router.post("/{document_id}/extract")
async def extract_document_data(document_id: int):
    """Extract data from a document using OCR and AI"""
    return {"message": f"Extract data from document {document_id} - to be implemented"}

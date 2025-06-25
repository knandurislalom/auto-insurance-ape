from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import sys
import os
import io

# Add the models path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from models import get_db
from models.schemas import DocumentResponse
from app.services.documents_service import documents_service

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    claim_id: Optional[int] = Query(None, description="Claim ID to associate with the document"),
    db: Session = Depends(get_db)
):
    """Upload a document for OCR processing"""
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload document
        result = await documents_service.upload_document(
            db=db,
            file_content=file_content,
            filename=file.filename,
            content_type=file.content_type,
            claim_id=claim_id
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading document: {str(e)}"
        )

@router.get("/{claim_id}", response_model=list)
async def get_claim_documents(
    claim_id: int,
    db: Session = Depends(get_db)
):
    """Get all documents for a specific claim"""
    try:
        documents = await documents_service.get_claim_documents(
            db=db,
            claim_id=claim_id
        )
        return documents
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving documents: {str(e)}"
        )

@router.post("/{document_id}/extract")
async def extract_document_data(
    document_id: int,
    extraction_method: str = Query("auto", regex="^(ocr|ai|auto)$", description="Extraction method"),
    db: Session = Depends(get_db)
):
    """Extract data from a document using OCR and AI"""
    try:
        result = await documents_service.extract_document_data(
            db=db,
            document_id=document_id,
            extraction_method=extraction_method
        )
        return result
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error extracting document data: {str(e)}"
        )

@router.get("/download/{document_id}")
async def download_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Download a document file"""
    try:
        content, filename, content_type = await documents_service.get_document_content(
            db=db,
            document_id=document_id
        )
        
        # Create streaming response
        def generate():
            yield content
        
        return StreamingResponse(
            io.BytesIO(content),
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error downloading document: {str(e)}"
        )

@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    remove_file: bool = Query(True, description="Whether to remove the physical file"),
    db: Session = Depends(get_db)
):
    """Delete a document"""
    try:
        success = await documents_service.delete_document(
            db=db,
            document_id=document_id,
            remove_file=remove_file
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document {document_id} not found"
            )
        
        return {"message": "Document deleted successfully", "document_id": document_id}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting document: {str(e)}"
        )

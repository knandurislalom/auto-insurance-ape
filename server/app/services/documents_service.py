"""
Documents Service - Business logic for document operations.

This service module handles document upload, storage, OCR processing,
and data extraction for insurance claims.
"""

from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
import os
import shutil
import uuid
from datetime import datetime
import logging
import json
from pathlib import Path

# Import models and schemas
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from models import get_db, Document, Claim
from models.schemas import DocumentCreate, DocumentResponse
from models.crud import document_crud, claim_crud

# Set up logging
logger = logging.getLogger(__name__)


class DocumentsService:
    """Service class for handling document operations."""
    
    def __init__(self):
        """Initialize the documents service."""
        self.upload_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'uploads')
        self.allowed_extensions = {'.pdf', '.jpg', '.jpeg', '.png', '.tiff', '.bmp'}
        self.max_file_size = 10 * 1024 * 1024  # 10 MB
        
        # Ensure upload directory exists
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def upload_document(
        self,
        db: Session,
        file_content: bytes,
        filename: str,
        content_type: str,
        claim_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Upload and store a document file.
        
        Args:
            db: Database session
            file_content: Binary content of the file
            filename: Original filename
            content_type: MIME type of the file
            claim_id: Optional claim ID to associate with the document
        
        Returns:
            Dictionary with upload result and document information
        """
        try:
            # Validate file
            await self._validate_file(file_content, filename, content_type)
            
            # Generate unique filename
            file_extension = Path(filename).suffix.lower()
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(self.upload_dir, unique_filename)
            
            # Save file to disk
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            # Create document record if claim_id is provided
            document = None
            if claim_id:
                # Verify claim exists
                claim = claim_crud.get(db=db, claim_id=claim_id)
                if not claim:
                    # Clean up uploaded file
                    os.remove(file_path)
                    raise ValueError(f"Claim {claim_id} not found")
                
                # Create document record
                document_data = DocumentCreate(
                    claim_id=claim_id,
                    filename=filename,
                    file_path=file_path,
                    file_type=content_type,
                    file_size=len(file_content)
                )
                
                document = document_crud.create(db=db, document_data=document_data)
            
            result = {
                "success": True,
                "message": "File uploaded successfully",
                "filename": filename,
                "unique_filename": unique_filename,
                "file_path": file_path,
                "file_size": len(file_content),
                "content_type": content_type
            }
            
            if document:
                result["document_id"] = document.id
                result["claim_id"] = claim_id
            
            logger.info(f"Successfully uploaded file: {filename} ({len(file_content)} bytes)")
            
            return result
            
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            raise
    
    async def get_claim_documents(
        self,
        db: Session,
        claim_id: int
    ) -> List[DocumentResponse]:
        """
        Get all documents for a specific claim.
        
        Args:
            db: Database session
            claim_id: ID of the claim
        
        Returns:
            List of documents for the claim
        """
        try:
            # Verify claim exists
            claim = claim_crud.get(db=db, claim_id=claim_id)
            if not claim:
                raise ValueError(f"Claim {claim_id} not found")
            
            # Get documents
            documents = document_crud.get_by_claim(db=db, claim_id=claim_id)
            
            # Convert to response format and add file status
            result = []
            for doc in documents:
                doc_dict = doc.to_dict()
                doc_dict['file_exists'] = os.path.exists(doc.file_path)
                doc_dict['file_size_mb'] = doc.file_size_mb
                doc_dict['is_image'] = doc.is_image
                doc_dict['is_pdf'] = doc.is_pdf
                result.append(doc_dict)
            
            logger.info(f"Retrieved {len(result)} documents for claim {claim_id}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error getting documents for claim {claim_id}: {str(e)}")
            raise
    
    async def extract_document_data(
        self,
        db: Session,
        document_id: int,
        extraction_method: str = "auto"
    ) -> Dict[str, Any]:
        """
        Extract data from a document using OCR and AI.
        
        Args:
            db: Database session
            document_id: ID of the document to process
            extraction_method: Method to use for extraction ('ocr', 'ai', 'auto')
        
        Returns:
            Extracted data and processing results
        """
        try:
            # Get document
            document = document_crud.get(db=db, document_id=document_id)
            if not document:
                raise ValueError(f"Document {document_id} not found")
            
            # Check if file exists
            if not os.path.exists(document.file_path):
                raise ValueError(f"Document file not found: {document.file_path}")
            
            # Extract data based on file type and method
            if document.is_image:
                extracted_data = await self._extract_from_image(document.file_path, extraction_method)
            elif document.is_pdf:
                extracted_data = await self._extract_from_pdf(document.file_path, extraction_method)
            else:
                raise ValueError(f"Unsupported file type: {document.file_type}")
            
            # Update document with extracted data
            document.set_extracted_data(extracted_data)
            db.commit()
            
            result = {
                "document_id": document_id,
                "extraction_method": extraction_method,
                "extracted_data": extracted_data,
                "processing_time": extracted_data.get("processing_time", 0),
                "confidence_score": extracted_data.get("confidence_score", 0.0),
                "status": "completed"
            }
            
            logger.info(f"Successfully extracted data from document {document_id}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error extracting data from document {document_id}: {str(e)}")
            raise
    
    async def delete_document(
        self,
        db: Session,
        document_id: int,
        remove_file: bool = True
    ) -> bool:
        """
        Delete a document and optionally remove the file.
        
        Args:
            db: Database session
            document_id: ID of the document to delete
            remove_file: Whether to remove the physical file
        
        Returns:
            True if successful, False if document not found
        """
        try:
            # Get document
            document = document_crud.get(db=db, document_id=document_id)
            if not document:
                return False
            
            file_path = document.file_path
            
            # Delete from database
            success = document_crud.delete(db=db, document_id=document_id)
            
            # Remove physical file if requested and exists
            if success and remove_file and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    logger.info(f"Removed file: {file_path}")
                except OSError as e:
                    logger.warning(f"Could not remove file {file_path}: {str(e)}")
            
            logger.info(f"Deleted document {document_id}")
            
            return success
            
        except Exception as e:
            logger.error(f"Error deleting document {document_id}: {str(e)}")
            raise
    
    async def get_document_content(
        self,
        db: Session,
        document_id: int
    ) -> Tuple[bytes, str, str]:
        """
        Get the content of a document file.
        
        Args:
            db: Database session
            document_id: ID of the document
        
        Returns:
            Tuple of (file_content, filename, content_type)
        """
        try:
            # Get document
            document = document_crud.get(db=db, document_id=document_id)
            if not document:
                raise ValueError(f"Document {document_id} not found")
            
            # Check if file exists
            if not os.path.exists(document.file_path):
                raise ValueError(f"Document file not found: {document.file_path}")
            
            # Read file content
            with open(document.file_path, 'rb') as f:
                content = f.read()
            
            return content, document.filename, document.file_type
            
        except Exception as e:
            logger.error(f"Error getting document content {document_id}: {str(e)}")
            raise
    
    async def _validate_file(
        self,
        file_content: bytes,
        filename: str,
        content_type: str
    ) -> None:
        """Validate uploaded file."""
        # Check file size
        if len(file_content) > self.max_file_size:
            raise ValueError(f"File too large. Maximum size: {self.max_file_size // (1024*1024)} MB")
        
        if len(file_content) == 0:
            raise ValueError("File is empty")
        
        # Check file extension
        file_extension = Path(filename).suffix.lower()
        if file_extension not in self.allowed_extensions:
            raise ValueError(f"File type not allowed. Allowed types: {', '.join(self.allowed_extensions)}")
        
        # Validate content type
        valid_content_types = {
            'application/pdf',
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/tiff',
            'image/bmp'
        }
        
        if content_type not in valid_content_types:
            logger.warning(f"Unexpected content type: {content_type}")
    
    async def _extract_from_image(
        self,
        file_path: str,
        method: str
    ) -> Dict[str, Any]:
        """Extract data from image file using OCR."""
        try:
            start_time = datetime.now()
            
            # Simulate OCR extraction
            # In a real implementation, you would use libraries like:
            # - pytesseract for OCR
            # - OpenCV for image preprocessing
            # - Cloud services like AWS Textract, Google Vision API
            
            extracted_data = {
                "text_content": "Sample extracted text from image",
                "driver_license": "DL123456789",
                "license_plate": "ABC123",
                "confidence_score": 0.85,
                "processing_time": (datetime.now() - start_time).total_seconds(),
                "extraction_method": method,
                "file_type": "image"
            }
            
            return extracted_data
            
        except Exception as e:
            logger.error(f"Error extracting from image {file_path}: {str(e)}")
            return {
                "error": str(e),
                "confidence_score": 0.0,
                "processing_time": 0,
                "extraction_method": method,
                "file_type": "image"
            }
    
    async def _extract_from_pdf(
        self,
        file_path: str,
        method: str
    ) -> Dict[str, Any]:
        """Extract data from PDF file."""
        try:
            start_time = datetime.now()
            
            # Simulate PDF text extraction
            # In a real implementation, you would use libraries like:
            # - PyPDF2 or pdfplumber for text extraction
            # - pdf2image + OCR for scanned PDFs
            # - Cloud services for AI-powered extraction
            
            extracted_data = {
                "text_content": "Sample extracted text from PDF",
                "policy_number": "POL123456789",
                "claim_amount": "5000",
                "date": "2024-12-24",
                "confidence_score": 0.92,
                "processing_time": (datetime.now() - start_time).total_seconds(),
                "extraction_method": method,
                "file_type": "pdf"
            }
            
            return extracted_data
            
        except Exception as e:
            logger.error(f"Error extracting from PDF {file_path}: {str(e)}")
            return {
                "error": str(e),
                "confidence_score": 0.0,
                "processing_time": 0,
                "extraction_method": method,
                "file_type": "pdf"
            }


# Create a singleton instance for easy import
documents_service = DocumentsService()

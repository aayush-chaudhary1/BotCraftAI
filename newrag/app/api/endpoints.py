from fastapi import APIRouter, UploadFile, File, HTTPException, Body, Query
from typing import List, Optional
import shutil
import os
import uuid
from pydantic import BaseModel

from app.services.ingestion import ingestion_service
from app.services.vector_store import vector_store_service
from app.services.rag_pipeline import rag_pipeline
from app.core.config import settings

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

class Source(BaseModel):
    documentId: Optional[str] = None
    source: str
    snippet: str
    score: Optional[float] = None
    metadata: Optional[dict] = None

class QueryResponse(BaseModel):
    answer: str
    sources: List[Source]

@router.post("/upload-documents")
async def upload_documents(files: List[UploadFile] = File(...)):
    """Legacy endpoint using default collection"""
    return await _process_upload(files, settings.COLLECTION_NAME)

@router.post("/chatbots/{chatbot_id}/upload-documents")
async def upload_chatbot_documents(
    chatbot_id: str,
    file: UploadFile = File(...), 
    documentId: str = Query(...)
):
    """
    Ingest a single document for a specific chatbot.
    Collection: settings.COLLECTION_PREFIX + chatbot_id
    """
    collection_name = f"{settings.COLLECTION_PREFIX}{chatbot_id}"
    # metadata per requirement: chatbotId, documentId, filename
    metadata = {
        "chatbotId": chatbot_id,
        "documentId": documentId,
        "filename": file.filename
    }
    
    # Reuse valid upload logic but for single file
    return await _process_upload([file], collection_name, metadata)

async def _process_upload(files: List[UploadFile], collection_name: str, metadata: dict = None):
    uploaded_files = []
    # Ensure temp directory for uploads exists
    upload_dir = os.path.join(settings.DATA_DIR, "uploads")
    os.makedirs(upload_dir, exist_ok=True)

    try:
        documents_to_add = []
        for file in files:
            # We use the provided filename (+uuid to avoid collision on disk)
            safe_filename = f"{uuid.uuid4()}_{file.filename}"
            file_path = os.path.join(upload_dir, safe_filename)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            uploaded_files.append(file_path)
            
            # Process document
            try:
                # If metadata is passed, we might want to update it with file specific info if needed
                # For single file upload, the passed metadata is correct.
                # For legacy multi-file, metadata is None, so it's fine.
                chunks = ingestion_service.process_document(file_path, metadata)
                documents_to_add.extend(chunks)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Error processing file {file.filename}: {str(e)}")

        # Add to vector store
        if documents_to_add:
            vector_store_service.add_documents(documents_to_add, collection_name)

        return {
            "message": f"Successfully processed {len(uploaded_files)} files.", 
            "files": [f.filename for f in files],
            "chunkCount": len(documents_to_add)
        }
    
    finally:
        # Optional cleanup
        pass

@router.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest):
    """Legacy query endpoint using default collection"""
    return await _process_query(request.query, settings.COLLECTION_NAME)

@router.post("/chatbots/{chatbot_id}/query", response_model=QueryResponse)
async def query_chatbot(chatbot_id: str, request: QueryRequest):
    """Query a specific chatbot's collection"""
    collection_name = f"{settings.COLLECTION_PREFIX}{chatbot_id}"
    return await _process_query(request.query, collection_name)

async def _process_query(query: str, collection_name: str):
    try:
        result = rag_pipeline.answer_question(query, collection_name)
        answer = result["result"]
        source_docs = result.get("source_documents", [])
        
        sources = []
        seen_snippets = set()
        
        for doc in source_docs:
            snippet = doc.page_content[:200]
            if snippet in seen_snippets:
                continue
            seen_snippets.add(snippet)
            
            sources.append(Source(
                documentId=doc.metadata.get("documentId"),
                source=doc.metadata.get("source", "unknown"),
                snippet=snippet,
                metadata=doc.metadata
            ))
        
        return QueryResponse(answer=answer, sources=sources)
    except Exception as e:
        # Chroma might raise error if collection doesn't exist
        print(f"Query error: {e}")
        return QueryResponse(answer="I couldn't find any information to answer that.", sources=[])

@router.delete("/chatbots/{chatbot_id}/documents/{document_id}")
async def delete_document(chatbot_id: str, document_id: str):
    """Delete all embeddings for a documentId in a chatbot's collection"""
    collection_name = f"{settings.COLLECTION_PREFIX}{chatbot_id}"
    try:
        vector_store_service.delete_document(collection_name, document_id)
        return {"status": "ok", "message": f"Document {document_id} deleted from {collection_name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

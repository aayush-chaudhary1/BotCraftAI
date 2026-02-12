import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

class IngestionService:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )

    def load_document(self, file_path: str) -> List[Document]:
        """Loads a document and returns a list of Documents."""
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            loader = PyPDFLoader(file_path)
        elif ext == ".docx":
            loader = Docx2txtLoader(file_path)
        elif ext == ".txt":
            loader = TextLoader(file_path, encoding="utf-8")
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        
        return loader.load()

    def process_document(self, file_path: str, metadata: dict = None) -> List[Document]:
        """Loads and splits the document into chunks."""
        documents = self.load_document(file_path)
        chunks = self.text_splitter.split_documents(documents)
        
        if metadata:
            for chunk in chunks:
                chunk.metadata.update(metadata)
        
        return chunks

ingestion_service = IngestionService()

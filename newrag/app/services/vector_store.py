import os
from langchain_chroma import Chroma
from langchain_core.documents import Document
from app.core.config import settings
from app.services.embeddings import embeddings_service

class VectorStoreService:
    def __init__(self):
        self.persist_directory = settings.VECTOR_DB_DIR
        self.embedding_function = embeddings_service.embeddings
        
        # Ensure directory exists
        if not os.path.exists(self.persist_directory):
            os.makedirs(self.persist_directory)

    def get_vector_store(self, collection_name: str = settings.COLLECTION_NAME):
        return Chroma(
            collection_name=collection_name,
            embedding_function=self.embedding_function,
            persist_directory=self.persist_directory
        )

    def add_documents(self, documents: list[Document], collection_name: str = settings.COLLECTION_NAME):
        vector_store = self.get_vector_store(collection_name)
        vector_store.add_documents(documents)
        
    def delete_document(self, collection_name: str, document_id: str):
        """Deletes all chunks associated with a document_id from the specified collection."""
        vector_store = self.get_vector_store(collection_name)
        
        # Get all embeddings to find IDs with matching metadata
        # Note: minimal implementation for Chroma. 
        # Ideally we'd use a `where` filter on delete, but LangChain wrapper might require specific method.
        # Direct Chroma delete with where filter:
        vector_store._collection.delete(where={"documentId": document_id})

vector_store_service = VectorStoreService()

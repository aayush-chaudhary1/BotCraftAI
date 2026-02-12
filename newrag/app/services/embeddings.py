from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings

class EmbeddingsService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)

    def get_embeddings(self):
        return self.embeddings

embeddings_service = EmbeddingsService()

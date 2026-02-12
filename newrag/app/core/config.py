import os
from dotenv import load_dotenv
load_dotenv()


class Settings:
    PROJECT_NAME: str = "Local RAG"
    PROJECT_VERSION: str = "1.0.0"
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR: str = os.path.join(os.path.dirname(BASE_DIR), "data")
    
    # Vector STore
    VECTOR_DB_DIR: str = os.path.join(DATA_DIR, "chroma_db")
    COLLECTION_NAME: str = "local_rag_knowledge"
    
    # Embeddings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # LLM
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

    # App Config
    COLLECTION_PREFIX: str = os.getenv("COLLECTION_PREFIX", "chatbot_")

settings = Settings()

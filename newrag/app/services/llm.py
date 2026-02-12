from langchain_community.llms import Ollama
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.llm = Ollama(
            base_url=settings.OLLAMA_BASE_URL,
            model=settings.OLLAMA_MODEL
        )

    def get_llm(self):
        return self.llm

llm_service = LLMService()

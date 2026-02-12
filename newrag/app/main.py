from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.api.endpoints import router
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Welcome to Local RAG API. Docs at /docs"}

@app.get("/health")
async def health():
    return {"status": "ok", "service": "rag"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=9000, reload=True)

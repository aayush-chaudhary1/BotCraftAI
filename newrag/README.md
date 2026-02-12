# Local RAG System

A complete Retrieval-Augmented Generation (RAG) backend using FastAPI, ChromaDB, Sentence-Transformers, and Ollama.

## Features
- Document Upload (PDF, DOCX, TXT)
- Automatic Text Chunking & Embeddings
- Vector Search with ChromaDB
- LLM Response Generation via Ollama (Llama 3, Mistral, etc.)
- REST API

## Prerequisites
1. **Python 3.10+**
2. **Ollama**: Download and install from [ollama.com](https://ollama.com).
   - Pull a model: `ollama pull llama3` (or `mistral`, `phi`, etc.)
   - Start the server: `ollama serve`

## Setup

1. **Clone/Navigate to project**
   ```bash
   cd path/to/project
   ```

2. **Create Virtual Environment & Install Dependencies**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure**
   - Edit `app/core/config.py` if you want to change the model name or paths.

## Running the Server

```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.
Docs: `http://localhost:8000/docs`.

## Usage API

### 1. Upload Documents
**POST** `/upload-documents`
- Form Data: `files` (List of files)

### 2. Query
**POST** `/query`
- JSON Body:
  ```json
  {
      "query": "What is ...?"
  }
  ```

## Example Script

## Development in VS Code
For a detailed guide on setting up and running this project in VS Code, see [VS Code Setup Guide](./VSCODE_GUIDE.md).

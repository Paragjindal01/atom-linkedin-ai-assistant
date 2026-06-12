# AltaAI RAG Service

Backend service for document ingestion, embeddings, vector search, retrieval, and LLM inference for the AltaAI internal assistant.

## Tech Stack

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Language**: Python 3.11+

## Project Structure

```
rag-service/
  app/
    main.py              # FastAPI application entry point
    api/
      routes.py          # API route definitions
    core/
      config.py          # Application configuration
    services/
      ingestion.py       # Document ingestion pipeline
      embeddings.py      # Embedding generation
      retrieval.py       # RAG retrieval logic
      llm.py             # LLM response generation
    storage/
      vector_store.py    # Vector database connection
  requirements.txt
  README.md
```

## Getting Started

```bash
cd rag-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Path      | Description                     |
|--------|-----------|---------------------------------|
| GET    | /health   | Service health check            |
| POST   | /query    | Query the RAG knowledge base    |

### Health Check

```
GET http://localhost:8000/health
```

Response:
```json
{
  "status": "ok",
  "service": "altaai-rag-service"
}
```

### Query

```
POST http://localhost:8000/query
Content-Type: application/json

{
  "question": "What does AltaAI do?"
}
```

Response:
```json
{
  "answer": "RAG pipeline is not connected yet.",
  "question": "What does AltaAI do?",
  "sources": []
}
```

## Status

All service modules are scaffolded with placeholder functions. The following are not yet connected:

- Document ingestion pipeline
- Embedding model
- Vector store
- LLM inference
- GPU acceleration

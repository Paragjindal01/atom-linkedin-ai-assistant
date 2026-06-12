from fastapi import APIRouter
from pydantic import BaseModel
from app.services.retrieval import retrieve_answer

router = APIRouter()


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
    question: str
    sources: list


@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "altaai-rag-service"}


@router.post("/query", response_model=QueryResponse)
async def query_knowledge(request: QueryRequest):
    result = await retrieve_answer(request.question)
    return result

async def retrieve_answer(question: str) -> dict:
    return {
        "answer": "RAG pipeline is not connected yet.",
        "question": question,
        "sources": [],
    }


async def retrieve_relevant_chunks(query: str, top_k: int = 5) -> list:
    return []

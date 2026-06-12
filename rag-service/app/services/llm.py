async def generate_response(prompt: str, context: str = "") -> str:
    return "LLM inference pipeline is not connected yet."


async def generate_response_with_sources(question: str, retrieved_chunks: list) -> dict:
    return {
        "answer": "LLM inference pipeline is not connected yet.",
        "question": question,
        "sources": [],
    }

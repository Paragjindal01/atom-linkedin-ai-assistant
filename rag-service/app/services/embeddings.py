async def generate_embedding(text: str) -> list[float]:
    return []


async def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    return [[] for _ in texts]

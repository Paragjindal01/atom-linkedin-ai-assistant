class VectorStore:
    def __init__(self, store_path: str = "./data/vector_store"):
        self.store_path = store_path
        self.connected = False

    async def connect(self) -> bool:
        self.connected = False
        return self.connected

    async def insert(self, embedding: list[float], metadata: dict) -> dict:
        return {
            "status": "pending",
            "message": "Vector store is not connected yet.",
        }

    async def search(self, query_embedding: list[float], top_k: int = 5) -> list:
        return []

    async def delete(self, document_id: str) -> bool:
        return False

    async def get_stats(self) -> dict:
        return {
            "connected": self.connected,
            "total_documents": 0,
            "total_vectors": 0,
        }

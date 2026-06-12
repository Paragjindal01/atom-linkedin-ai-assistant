from typing import Any


async def ingest_document(file_path: str, metadata: dict | None = None) -> dict:
    return {
        "status": "pending",
        "message": "Document ingestion pipeline is not connected yet.",
        "file_path": file_path,
    }


async def ingest_text(text: str, source: str = "manual", metadata: dict | None = None) -> dict:
    return {
        "status": "pending",
        "message": "Text ingestion pipeline is not connected yet.",
        "source": source,
    }

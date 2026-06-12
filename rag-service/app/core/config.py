from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SERVICE_NAME: str = "altaai-rag-service"
    VERSION: str = "0.1.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:5174"]
    VECTOR_STORE_PATH: str = "./data/vector_store"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    LLM_MODEL: str = "gpt-3.5-turbo"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

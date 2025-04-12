from pydantic_settings import BaseSettings

from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SECRET_KEY: str = "supersecretkey"
    RABBITMQ_URL: str = os.getenv("RABBITMQ_URL")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    UPLOAD_DIR: str = "uploaded_documents"
    

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

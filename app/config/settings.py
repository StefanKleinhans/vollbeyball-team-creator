import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_STRING_URL: str = os.getenv("POSTGRES_DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://localhost:3000",
    ]
    
    # Add production origins from environment
    if os.getenv("CORS_ORIGINS"):
        CORS_ORIGINS.extend(os.getenv("CORS_ORIGINS").split(","))

settings = Settings()

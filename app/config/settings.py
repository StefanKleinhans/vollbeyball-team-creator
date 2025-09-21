import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DB_STRING_URL: str = os.getenv("POSTGRES_DATABASE_URL")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM")

settings = Settings()

from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "Smart Event Assistant"

    class Config:
        env_file = ".env"

settings = Settings()

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "Auto Insurance Claims Processor"
    debug: bool = True
    database_url: str = "sqlite:///./database/claims.db"
    upload_dir: str = "./uploads"
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = [
        "image/jpeg", "image/png", "image/tiff", 
        "application/pdf", "text/plain"
    ]
    
    # LangChain settings
    openai_api_key: Optional[str] = None
    langchain_verbose: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Primetrade Assignment API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "DEVELOPMENT_SECRET_KEY_REPLACE_IN_PRODUCTION"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "app"
    POSTGRES_PORT: str = "5432"
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # Default to SQLite if Postgres fields are not fully provided or if DATABASE_URL is SQLite
        if "sqlite" in self.DATABASE_URL and not all([self.POSTGRES_USER, self.POSTGRES_PASSWORD, self.POSTGRES_SERVER, self.POSTGRES_DB]):
             return self.DATABASE_URL
        
        # Construct Postgres URL if possible
        if all([self.POSTGRES_USER, self.POSTGRES_PASSWORD, self.POSTGRES_SERVER, self.POSTGRES_DB]):
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        
        return self.DATABASE_URL
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

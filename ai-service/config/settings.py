"""
Configuration settings for CaboAI Service
"""

import os
from functools import lru_cache
from typing import List, Optional

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    app_name: str = Field(default="CaboAI Service", env="APP_NAME")
    environment: str = Field(default="development", env="ENVIRONMENT")
    debug: bool = Field(default=False, env="DEBUG")
    
    # Server
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    workers: int = Field(default=1, env="WORKERS")
    
    # Security
    api_key: str = Field(env="AI_SERVICE_API_KEY")
    secret_key: str = Field(env="SECRET_KEY")
    
    # CORS
    cors_origin: str = Field(env="CORS_ORIGIN")
    cors_origins: List[str] = Field(default_factory=list, env="CORS_ORIGINS")
    
    # Database
    database_url: Optional[str] = Field(default=None, env="DATABASE_URL")
    db_pool_size: int = Field(default=5, env="DB_POOL_SIZE")
    db_max_overflow: int = Field(default=10, env="DB_MAX_OVERFLOW")
    
    # Redis
    redis_url: Optional[str] = Field(default=None, env="REDIS_URL")
    redis_host: str = Field(default="localhost", env="REDIS_HOST")
    redis_port: int = Field(default=6379, env="REDIS_PORT")
    redis_password: Optional[str] = Field(default=None, env="REDIS_PASSWORD")
    
    # OpenAI
    openai_api_key: str = Field(env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4", env="OPENAI_MODEL")
    openai_max_tokens: int = Field(default=2000, env="OPENAI_MAX_TOKENS")
    openai_temperature: float = Field(default=0.7, env="OPENAI_TEMPERATURE")
    
    # Los Cabos specific
    timezone: str = Field(default="America/Mazatlan", env="TIMEZONE")
    default_language: str = Field(default="es", env="DEFAULT_LANGUAGE")
    supported_languages: List[str] = Field(
        default=["es", "en"], 
        env="SUPPORTED_LANGUAGES"
    )
    
    # Business directory
    business_directory_cache_ttl: int = Field(default=3600, env="BUSINESS_DIRECTORY_CACHE_TTL")
    
    # Currency
    currency_api_key: Optional[str] = Field(default=None, env="CURRENCY_API_KEY")
    banxico_token: Optional[str] = Field(default=None, env="BANXICO_TOKEN")
    
    # Rate limiting
    rate_limit_requests: int = Field(default=100, env="RATE_LIMIT_REQUESTS")
    rate_limit_window: int = Field(default=60, env="RATE_LIMIT_WINDOW")
    
    # Monitoring
    sentry_dsn: Optional[str] = Field(default=None, env="SENTRY_DSN")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Features
    enable_analytics: bool = Field(default=True, env="ENABLE_ANALYTICS")
    enable_translations: bool = Field(default=True, env="ENABLE_TRANSLATIONS")
    enable_business_intelligence: bool = Field(default=True, env="ENABLE_BUSINESS_INTELLIGENCE")
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
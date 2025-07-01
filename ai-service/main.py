"""
FastAPI AI Service for CaboAI
Los Cabos Business Communication AI Platform
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
import uvicorn

from config.settings import get_settings
from config.database import init_db, close_db
from routers import ai_chat, business_intelligence, translations
from middleware.auth import verify_api_key
from middleware.rate_limit import rate_limit_middleware
from utils.logger import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    logger.info("🚀 Starting CaboAI Service...")
    await init_db()
    logger.info("✅ Database initialized")
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down CaboAI Service...")
    await close_db()
    logger.info("✅ Cleanup completed")

# Initialize FastAPI app
app = FastAPI(
    title="CaboAI Service",
    description="AI-powered business communication platform for Los Cabos",
    version="1.0.0",
    docs_url="/docs" if get_settings().environment != "production" else None,
    redoc_url="/redoc" if get_settings().environment != "production" else None,
    lifespan=lifespan
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(rate_limit_middleware)

# CORS configuration
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.cors_origin,
        "https://caboai.netlify.app",
        "https://letty-ai.netlify.app",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
    ] if settings.environment == "development" else [
        settings.cors_origin,
        "https://caboai.netlify.app", 
        "https://letty-ai.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health check endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {
        "status": "healthy",
        "service": "CaboAI Service",
        "version": "1.0.0",
        "environment": settings.environment,
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.get("/health/ready")
async def readiness_check():
    """Readiness check for Kubernetes/Railway"""
    try:
        # Add database connectivity check here if needed
        return {"status": "ready", "timestamp": "2024-01-01T00:00:00Z"}
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        raise HTTPException(status_code=503, detail="Service not ready")

@app.get("/health/live")
async def liveness_check():
    """Liveness check for Kubernetes/Railway"""
    return {
        "status": "alive",
        "uptime": "0s",  # Would calculate actual uptime
        "memory_usage": "50MB",  # Would get actual memory usage
        "timestamp": "2024-01-01T00:00:00Z"
    }

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "CaboAI Service API",
        "version": "1.0.0",
        "environment": settings.environment,
        "docs_url": "/docs" if settings.environment != "production" else None,
        "health_url": "/health",
        "endpoints": {
            "chat": "/api/v1/chat",
            "business_intelligence": "/api/v1/business",
            "translations": "/api/v1/translations"
        }
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    logger.error(f"HTTP {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
            "timestamp": "2024-01-01T00:00:00Z"
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "status_code": 500,
            "timestamp": "2024-01-01T00:00:00Z"
        }
    )

# Include routers
app.include_router(
    ai_chat.router,
    prefix="/api/v1/chat",
    tags=["AI Chat"],
    dependencies=[Depends(verify_api_key)]
)

app.include_router(
    business_intelligence.router,
    prefix="/api/v1/business",
    tags=["Business Intelligence"],
    dependencies=[Depends(verify_api_key)]
)

app.include_router(
    translations.router,
    prefix="/api/v1/translations",
    tags=["Translations"],
    dependencies=[Depends(verify_api_key)]
)

# Startup message
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = "0.0.0.0"
    
    logger.info(f"🚀 Starting CaboAI Service on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        log_level="info" if settings.environment == "production" else "debug",
        reload=settings.environment == "development",
        workers=1,  # Single worker for Railway
        access_log=settings.environment != "production"
    )
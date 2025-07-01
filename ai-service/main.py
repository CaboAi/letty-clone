"""
CaboAi AI Service - Intelligent Email Generation for Los Cabos Businesses
"""

import logging
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config.settings import get_settings
from app.services.openai_service import get_openai_service
from app.services.conversation_service import get_conversation_service
from app.services.usage_service import get_usage_service
from app.services.prompt_templates import PromptTemplateService, BusinessType, InquiryType
from app.models.email_models import (
    EmailRequest, EmailResponse, ConversationHistoryRequest, ConversationHistoryResponse,
    UsageStatsRequest, UsageStatsResponse, RateLimitResponse, HealthResponse
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    logger.info("Starting CaboAi AI Service...")
    
    # Startup
    settings = get_settings()
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"OpenAI Model: {settings.openai_model}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down CaboAi AI Service...")

app = FastAPI(
    title="CaboAi AI Service",
    description="Intelligent email generation for Los Cabos businesses",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "message": "CaboAi AI Service is running!",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    """Enhanced health check endpoint"""
    openai_service = get_openai_service()
    conversation_service = get_conversation_service()
    usage_service = get_usage_service()
    
    try:
        # Test OpenAI connection (simple way)
        openai_status = "connected"
    except Exception as e:
        openai_status = f"error: {str(e)}"
    
    # Get service statistics
    conv_analytics = conversation_service.get_analytics()
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat(),
        version="1.0.0",
        openai_status=openai_status,
        conversation_count=conv_analytics.get("total_conversations", 0),
        total_usage_records=conv_analytics.get("total_messages", 0)
    )

@app.post("/generate-email", response_model=EmailResponse)
async def generate_email(request: EmailRequest):
    """Generate intelligent email response"""
    
    openai_service = get_openai_service()
    conversation_service = get_conversation_service()
    usage_service = get_usage_service()
    
    try:
        # Create or get conversation
        conversation_id = request.conversation_id
        if not conversation_id:
            conversation_id = conversation_service.create_conversation(
                user_email=request.user_email,
                business_id=request.business_id,
                metadata={"industry": request.industry, "initial_tone": request.tone}
            )
        
        # Check rate limits and process request
        usage_result = await usage_service.process_request(
            user_id=request.user_email,
            business_id=request.business_id,
            endpoint="generate-email"
        )
        
        if not usage_result["allowed"]:
            raise HTTPException(
                status_code=429,
                detail=usage_result["error"]
            )
        
        # Get conversation history for context
        conversation_history = conversation_service.get_conversation_history(
            conversation_id, message_count=5
        )
        
        # Add incoming email to conversation
        conversation_service.add_message(
            conversation_id, "user", request.email_content
        )
        
        # Generate response using OpenAI
        ai_response = await openai_service.generate_email_response(
            email_content=request.email_content,
            conversation_history=conversation_history,
            tone=request.tone,
            industry=request.industry,
            language=request.language,
            business_context=request.business_context
        )
        
        # Add AI response to conversation
        if ai_response["success"]:
            conversation_service.add_message(
                conversation_id, "assistant", ai_response["response"],
                metadata={
                    "tokens_used": ai_response["tokens_used"],
                    "model": ai_response["model"],
                    "tone": ai_response["tone"],
                    "industry": request.industry
                }
            )
            
            # Record usage with actual tokens
            await usage_service.process_request(
                user_id=request.user_email,
                business_id=request.business_id,
                endpoint="generate-email",
                tokens_used=ai_response["tokens_used"],
                model=ai_response["model"],
                metadata={"conversation_id": conversation_id}
            )
        
        # Get updated usage stats
        usage_stats = usage_service.get_usage_stats(
            user_id=request.user_email,
            business_id=request.business_id,
            days=1
        )
        
        return EmailResponse(
            response=ai_response["response"],
            conversation_id=conversation_id,
            tone=ai_response["tone"],
            industry=request.industry,
            language=ai_response["language"],
            tokens_used=ai_response.get("tokens_used", 0),
            model=ai_response.get("model", "unknown"),
            success=ai_response["success"],
            error=ai_response.get("error"),
            rate_limit=usage_result.get("rate_limit"),
            usage_stats=usage_stats
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating email: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating email: {str(e)}")

@app.get("/conversation/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_history(conversation_id: str, message_count: int = 10):
    """Get conversation history"""
    
    conversation_service = get_conversation_service()
    conversation = conversation_service.get_conversation(conversation_id)
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = conversation_service.get_conversation_history(conversation_id, message_count)
    context_summary = conversation_service.get_conversation_context(conversation_id)
    
    return ConversationHistoryResponse(
        conversation_id=conversation_id,
        messages=messages,
        context_summary=context_summary,
        created_at=conversation.created_at.isoformat(),
        updated_at=conversation.updated_at.isoformat()
    )

@app.get("/usage-stats", response_model=UsageStatsResponse)
async def get_usage_stats(
    user_id: Optional[str] = None,
    business_id: Optional[str] = None,
    days: int = 30
):
    """Get usage statistics"""
    
    usage_service = get_usage_service()
    stats = usage_service.get_usage_stats(user_id, business_id, days)
    
    return UsageStatsResponse(**stats)

@app.get("/rate-limit-status", response_model=RateLimitResponse)
async def get_rate_limit_status(
    user_id: Optional[str] = None,
    business_id: Optional[str] = None,
    endpoint: str = "default"
):
    """Get current rate limit status"""
    
    usage_service = get_usage_service()
    rate_limit_info = await usage_service.get_rate_limit_status(user_id, business_id, endpoint)
    
    return RateLimitResponse(
        requests_remaining=rate_limit_info.requests_remaining,
        reset_time=rate_limit_info.reset_time.isoformat(),
        total_requests=rate_limit_info.total_requests,
        window_seconds=rate_limit_info.window_seconds
    )

# Legacy chat endpoint for backward compatibility
@app.post("/chat")
async def chat(request: EmailRequest):
    """Legacy chat endpoint - redirects to generate-email"""
    return await generate_email(request)

if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        workers=settings.workers if not settings.debug else 1
    )

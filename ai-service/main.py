from fastapi import FastAPI, HTTPException
import os
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

from config.settings import get_settings
from app.services.openai_service import get_openai_service
from app.services.conversation_service import get_conversation_service
from app.services.usage_service import get_usage_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CaboAi AI Service")

class ToneType(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"  
    FRIENDLY = "friendly"

class IndustryType(str, Enum):
    HOSPITALITY = "hospitality"
    REAL_ESTATE = "real_estate"
    TOURISM = "tourism"
    GENERAL = "general"

class ChatMessage(BaseModel):
    message: str
    tone: ToneType = ToneType.PROFESSIONAL
    industry: IndustryType = IndustryType.HOSPITALITY
    language: str = Field(default="auto", description="Language preference: auto, es, en")
    user_id: Optional[str] = Field(None, description="User identifier for conversation tracking")
    business_context: Optional[Dict[str, Any]] = Field(None, description="Business context information")

class ChatResponse(BaseModel):
    response: str
    tone: str
    industry: str
    language: str
    conversation_id: str
    tokens_used: int
    success: bool
    error: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "CaboAi AI Service is running!", "status": "healthy"}

@app.get("/health")
async def health():
    """Enhanced health check with OpenAI connectivity"""
    try:
        # Basic health check
        health_status = {"status": "healthy"}
        
        # Check OpenAI service availability
        openai_service = get_openai_service()
        health_status["openai_available"] = True
        
        # Get conversation service stats
        conversation_service = get_conversation_service()
        analytics = conversation_service.get_analytics()
        health_status["conversations"] = analytics.get("total_conversations", 0)
        
        return health_status
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "degraded", "error": str(e)}

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """Upgraded chat endpoint with real OpenAI integration"""
    
    openai_service = get_openai_service()
    conversation_service = get_conversation_service()
    usage_service = get_usage_service()
    
    try:
        # Create conversation for context tracking
        conversation_id = conversation_service.create_conversation(
            user_email=chat_message.user_id,
            metadata={
                "industry": chat_message.industry,
                "tone": chat_message.tone,
                "language": chat_message.language
            }
        )
        
        # Check rate limits
        usage_result = await usage_service.process_request(
            user_id=chat_message.user_id,
            endpoint="chat"
        )
        
        if not usage_result["allowed"]:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )
        
        # Add user message to conversation
        conversation_service.add_message(
            conversation_id, "user", chat_message.message
        )
        
        # Generate AI response using OpenAI
        ai_response = await openai_service.generate_email_response(
            email_content=chat_message.message,
            tone=chat_message.tone,
            industry=chat_message.industry,
            language=chat_message.language,
            business_context=chat_message.business_context
        )
        
        # Add AI response to conversation
        if ai_response["success"]:
            conversation_service.add_message(
                conversation_id, "assistant", ai_response["response"],
                metadata={
                    "tokens_used": ai_response["tokens_used"],
                    "model": ai_response["model"]
                }
            )
            
            # Record usage
            await usage_service.process_request(
                user_id=chat_message.user_id,
                endpoint="chat",
                tokens_used=ai_response["tokens_used"],
                model=ai_response["model"]
            )
        
        return ChatResponse(
            response=ai_response["response"],
            tone=ai_response["tone"],
            industry=chat_message.industry,
            language=ai_response["language"],
            conversation_id=conversation_id,
            tokens_used=ai_response.get("tokens_used", 0),
            success=ai_response["success"],
            error=ai_response.get("error")
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}", exc_info=True)
        
        # Provide fallback response
        fallback_response = _get_fallback_response(
            chat_message.tone, 
            chat_message.language,
            chat_message.industry
        )
        
        return ChatResponse(
            response=fallback_response,
            tone=chat_message.tone,
            industry=chat_message.industry,
            language=chat_message.language,
            conversation_id="fallback",
            tokens_used=0,
            success=False,
            error=str(e)
        )

def _get_fallback_response(tone: str, language: str, industry: str) -> str:
    """Provide fallback responses when OpenAI is unavailable"""
    
    responses = {
        "es": {
            "professional": {
                "hospitality": "Gracias por contactarnos. Hemos recibido su consulta sobre nuestros servicios de hospitalidad en Los Cabos y nos pondremos en contacto con usted pronto.",
                "real_estate": "Agradecemos su interés en las propiedades de Los Cabos. Nuestro equipo revisará su consulta y le proporcionará información detallada muy pronto.",
                "tourism": "¡Gracias por su interés en nuestros tours y actividades en Los Cabos! Procesaremos su solicitud y le enviaremos opciones personalizadas.",
                "general": "Gracias por su mensaje. Hemos recibido su consulta y nos pondremos en contacto con usted pronto."
            },
            "casual": {
                "hospitality": "¡Hola! Gracias por escribirnos. Recibimos tu consulta sobre nuestros hoteles en Los Cabos y te responderemos muy pronto.",
                "real_estate": "¡Hola! Gracias por tu interés en propiedades de Los Cabos. Te contactaremos pronto con información detallada.",
                "tourism": "¡Hola! Nos emociona ayudarte a planear tu aventura en Los Cabos. Te enviaremos opciones increíbles muy pronto.",
                "general": "¡Hola! Gracias por escribirnos. Recibimos tu mensaje y te responderemos pronto."
            },
            "friendly": {
                "hospitality": "¡Hola! Muchas gracias por contactarnos. Estamos emocionados de ayudarte con tu estadía en Los Cabos y te responderemos muy pronto.",
                "real_estate": "¡Hola! Nos da mucho gusto tu interés en Los Cabos. Te ayudaremos a encontrar la propiedad perfecta. ¡Te contactamos pronto!",
                "tourism": "¡Hola! ¡Qué emocionante que quieras explorar Los Cabos! Te enviaremos las mejores opciones de tours y actividades muy pronto.",
                "general": "¡Hola! Muchas gracias por contactarnos. Estamos aquí para ayudarte y te responderemos muy pronto."
            }
        },
        "en": {
            "professional": {
                "hospitality": "Thank you for contacting us. We have received your inquiry about our hospitality services in Los Cabos and will get back to you shortly.",
                "real_estate": "We appreciate your interest in Los Cabos properties. Our team will review your inquiry and provide you with detailed information soon.",
                "tourism": "Thank you for your interest in our Los Cabos tours and activities! We will process your request and send you personalized options.",
                "general": "Thank you for your message. We have received your inquiry and will get back to you soon."
            },
            "casual": {
                "hospitality": "Hi there! Thanks for reaching out. We got your inquiry about our Los Cabos hotels and will get back to you soon.",
                "real_estate": "Hi! Thanks for your interest in Los Cabos properties. We'll contact you soon with detailed information.",
                "tourism": "Hi! We're excited to help you plan your Los Cabos adventure. We'll send you some amazing options soon.",
                "general": "Hi! Thanks for reaching out. We got your message and will get back to you soon."
            },
            "friendly": {
                "hospitality": "Hello! Thank you so much for contacting us. We're excited to help you with your Los Cabos stay and will respond very soon.",
                "real_estate": "Hello! We're thrilled about your interest in Los Cabos. We'll help you find the perfect property. Talk soon!",
                "tourism": "Hello! How exciting that you want to explore Los Cabos! We'll send you the best tour and activity options very soon.",
                "general": "Hello! Thank you so much for contacting us. We're here to help and will respond very soon."
            }
        }
    }
    
    # Determine language
    lang = "es" if language == "es" else "en"
    
    # Get response
    return responses.get(lang, responses["en"]).get(tone, responses[lang]["professional"]).get(industry, responses[lang][tone]["general"])

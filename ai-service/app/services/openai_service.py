"""
OpenAI Service for CaboAi intelligent email generation
"""

import logging
from typing import Dict, List, Optional, Any
from openai import OpenAI, AsyncOpenAI
from openai.types.chat import ChatCompletion
import asyncio
from functools import lru_cache

from config.settings import get_settings

logger = logging.getLogger(__name__)

class OpenAIService:
    """OpenAI service for intelligent email generation"""
    
    def __init__(self):
        self.settings = get_settings()
        self.client = AsyncOpenAI(api_key=self.settings.openai_api_key)
        
    async def generate_email_response(
        self,
        email_content: str,
        conversation_history: List[Dict[str, str]] = None,
        tone: str = "professional",
        industry: str = "hospitality",
        language: str = "auto",
        business_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Generate intelligent email response using OpenAI
        
        Args:
            email_content: The incoming email content
            conversation_history: Previous conversation messages
            tone: Response tone (professional, casual, friendly)
            industry: Business industry (hospitality, real_estate, tourism)
            language: Response language (auto, es, en)
            business_context: Additional business information
            
        Returns:
            Dict containing generated response and metadata
        """
        try:
            # Build system prompt
            system_prompt = self._build_system_prompt(tone, industry, language, business_context)
            
            # Build conversation context
            messages = self._build_conversation_context(
                email_content, conversation_history, system_prompt
            )
            
            # Generate response
            response = await self.client.chat.completions.create(
                model=self.settings.openai_model,
                messages=messages,
                max_tokens=self.settings.openai_max_tokens,
                temperature=self.settings.openai_temperature,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            generated_text = response.choices[0].message.content
            
            # Detect language if auto
            detected_language = self._detect_language(generated_text) if language == "auto" else language
            
            return {
                "response": generated_text,
                "tone": tone,
                "industry": industry,
                "language": detected_language,
                "tokens_used": response.usage.total_tokens,
                "model": self.settings.openai_model,
                "success": True
            }
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return {
                "response": self._get_fallback_response(tone, language),
                "tone": tone,
                "industry": industry,
                "language": language,
                "error": str(e),
                "success": False
            }
    
    def _build_system_prompt(
        self, 
        tone: str, 
        industry: str, 
        language: str, 
        business_context: Dict[str, Any] = None
    ) -> str:
        """Build system prompt based on context"""
        
        base_prompt = """You are CaboAi, an intelligent email assistant specialized in Los Cabos, Mexico business communications. You help local businesses respond to customer inquiries professionally and efficiently."""
        
        # Tone instructions
        tone_instructions = {
            "professional": "Maintain a professional, courteous tone while being helpful and informative.",
            "casual": "Use a friendly, approachable tone that feels personal and welcoming.",
            "friendly": "Be warm, enthusiastic, and genuinely helpful in your responses."
        }
        
        # Industry-specific context
        industry_context = {
            "hospitality": "You specialize in hotel, resort, and accommodation inquiries. Focus on amenities, availability, rates, and guest experience. Include relevant details about Los Cabos attractions and activities.",
            "real_estate": "You handle property inquiries, sales, and rentals in Los Cabos. Emphasize location benefits, property features, investment potential, and local market knowledge.",
            "tourism": "You assist with tour bookings, activity reservations, and travel planning in Los Cabos. Highlight unique experiences, safety, pricing, and local insights."
        }
        
        # Language instructions
        language_instructions = {
            "es": "Always respond in Spanish. Use proper Mexican Spanish terminology and expressions.",
            "en": "Always respond in English. Use clear, professional English appropriate for international clients.",
            "auto": "Detect the language of the incoming message and respond in the same language. If mixed languages, prioritize Spanish for local context and English for international appeal."
        }
        
        # Business context
        business_info = ""
        if business_context:
            business_info = f"\nBusiness Information:\n- Name: {business_context.get('name', 'N/A')}\n- Location: {business_context.get('location', 'Los Cabos')}\n- Specialties: {business_context.get('specialties', 'N/A')}"
        
        return f"""{base_prompt}

TONE: {tone_instructions.get(tone, tone_instructions['professional'])}

INDUSTRY FOCUS: {industry_context.get(industry, industry_context['hospitality'])}

LANGUAGE: {language_instructions.get(language, language_instructions['auto'])}

{business_info}

IMPORTANT GUIDELINES:
- Always be helpful and solution-oriented
- Include specific details when possible
- Mention Los Cabos attractions or benefits when relevant
- Ask clarifying questions if needed
- Provide contact information or next steps
- Keep responses concise but complete
- Use local knowledge to add value"""

    def _build_conversation_context(
        self, 
        email_content: str, 
        conversation_history: List[Dict[str, str]] = None,
        system_prompt: str = ""
    ) -> List[Dict[str, str]]:
        """Build conversation context for OpenAI"""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history
        if conversation_history:
            for msg in conversation_history[-5:]:  # Last 5 messages for context
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
        
        # Add current email
        messages.append({
            "role": "user", 
            "content": f"Please respond to this email:\n\n{email_content}"
        })
        
        return messages
    
    def _detect_language(self, text: str) -> str:
        """Simple language detection"""
        spanish_indicators = ['hola', 'gracias', 'por favor', 'buenos', 'saludos', 'estimado', 'cordialmente']
        english_indicators = ['hello', 'thank', 'please', 'best', 'regards', 'dear', 'sincerely']
        
        text_lower = text.lower()
        spanish_count = sum(1 for word in spanish_indicators if word in text_lower)
        english_count = sum(1 for word in english_indicators if word in text_lower)
        
        return "es" if spanish_count > english_count else "en"
    
    def _get_fallback_response(self, tone: str, language: str) -> str:
        """Provide fallback response when OpenAI fails"""
        
        fallbacks = {
            "es": {
                "professional": "Gracias por su mensaje. Hemos recibido su consulta y nos pondremos en contacto con usted pronto para brindarle la información que necesita.",
                "casual": "¡Hola! Gracias por escribirnos. Recibimos tu mensaje y te responderemos muy pronto con toda la información.",
                "friendly": "¡Hola! Muchas gracias por contactarnos. Estamos emocionados de ayudarte y te responderemos muy pronto con todos los detalles."
            },
            "en": {
                "professional": "Thank you for your inquiry. We have received your message and will get back to you shortly with the information you need.",
                "casual": "Hi there! Thanks for reaching out. We got your message and will get back to you soon with all the details.",
                "friendly": "Hello! Thank you so much for contacting us. We're excited to help you and will respond very soon with all the information!"
            }
        }
        
        return fallbacks.get(language, fallbacks["en"]).get(tone, fallbacks["en"]["professional"])

# Singleton instance
@lru_cache()
def get_openai_service() -> OpenAIService:
    """Get cached OpenAI service instance"""
    return OpenAIService()
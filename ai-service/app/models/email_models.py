"""
Pydantic models for email generation API
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum

class ToneType(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    FRIENDLY = "friendly"

class IndustryType(str, Enum):
    HOSPITALITY = "hospitality"
    REAL_ESTATE = "real_estate"
    TOURISM = "tourism"
    RESTAURANT = "restaurant"

class LanguageType(str, Enum):
    AUTO = "auto"
    SPANISH = "es"
    ENGLISH = "en"

class EmailRequest(BaseModel):
    """Request model for email generation"""
    email_content: str = Field(..., description="The incoming email content to respond to")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for context tracking")
    user_email: Optional[str] = Field(None, description="User's email address")
    business_id: Optional[str] = Field(None, description="Business identifier")
    tone: ToneType = Field(ToneType.PROFESSIONAL, description="Response tone")
    industry: IndustryType = Field(IndustryType.HOSPITALITY, description="Business industry type")
    language: LanguageType = Field(LanguageType.AUTO, description="Response language")
    business_context: Optional[Dict[str, Any]] = Field(None, description="Additional business information")

class EmailResponse(BaseModel):
    """Response model for email generation"""
    response: str = Field(..., description="Generated email response")
    conversation_id: str = Field(..., description="Conversation ID")
    tone: str = Field(..., description="Applied tone")
    industry: str = Field(..., description="Business industry")
    language: str = Field(..., description="Detected/used language")
    tokens_used: int = Field(..., description="OpenAI tokens consumed")
    model: str = Field(..., description="AI model used")
    success: bool = Field(..., description="Generation success status")
    error: Optional[str] = Field(None, description="Error message if failed")
    rate_limit: Optional[Dict[str, Any]] = Field(None, description="Rate limit information")
    usage_stats: Optional[Dict[str, Any]] = Field(None, description="Usage statistics")

class ConversationHistoryRequest(BaseModel):
    """Request model for conversation history"""
    conversation_id: str = Field(..., description="Conversation ID")
    message_count: int = Field(10, description="Number of recent messages to retrieve")

class ConversationHistoryResponse(BaseModel):
    """Response model for conversation history"""
    conversation_id: str = Field(..., description="Conversation ID")
    messages: List[Dict[str, str]] = Field(..., description="Conversation messages")
    context_summary: Dict[str, Any] = Field(..., description="Conversation context summary")
    created_at: str = Field(..., description="Conversation creation timestamp")
    updated_at: str = Field(..., description="Last update timestamp")

class UsageStatsRequest(BaseModel):
    """Request model for usage statistics"""
    user_id: Optional[str] = Field(None, description="User ID")
    business_id: Optional[str] = Field(None, description="Business ID")
    days: int = Field(30, description="Number of days to include in stats")

class UsageStatsResponse(BaseModel):
    """Response model for usage statistics"""
    total_requests: int = Field(..., description="Total number of requests")
    total_tokens: int = Field(..., description="Total tokens used")
    total_cost: float = Field(..., description="Total estimated cost")
    daily_average: float = Field(..., description="Average requests per day")
    period_days: int = Field(..., description="Period covered in days")
    endpoint_breakdown: Dict[str, Dict[str, Any]] = Field(..., description="Usage by endpoint")
    first_request: Optional[str] = Field(None, description="First request timestamp")
    last_request: Optional[str] = Field(None, description="Last request timestamp")

class RateLimitResponse(BaseModel):
    """Response model for rate limit status"""
    requests_remaining: int = Field(..., description="Requests remaining in current window")
    reset_time: str = Field(..., description="Rate limit reset time")
    total_requests: int = Field(..., description="Total requests in current window")
    window_seconds: int = Field(..., description="Rate limit window duration")

class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="API version")
    openai_status: str = Field(..., description="OpenAI connection status")
    conversation_count: int = Field(..., description="Active conversations")
    total_usage_records: int = Field(..., description="Total usage records")
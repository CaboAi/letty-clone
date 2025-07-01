"""
Conversation memory and context tracking service
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from uuid import uuid4

logger = logging.getLogger(__name__)

@dataclass
class ConversationMessage:
    """Individual conversation message"""
    id: str
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime
    metadata: Dict[str, Any] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage"""
        data = asdict(self)
        data['timestamp'] = self.timestamp.isoformat()
        return data
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ConversationMessage':
        """Create from dictionary"""
        data['timestamp'] = datetime.fromisoformat(data['timestamp'])
        return cls(**data)

@dataclass
class ConversationContext:
    """Complete conversation context"""
    conversation_id: str
    user_email: Optional[str]
    business_id: Optional[str]
    messages: List[ConversationMessage]
    created_at: datetime
    updated_at: datetime
    metadata: Dict[str, Any] = None
    
    def add_message(self, role: str, content: str, metadata: Dict[str, Any] = None):
        """Add a new message to the conversation"""
        message = ConversationMessage(
            id=str(uuid4()),
            role=role,
            content=content,
            timestamp=datetime.utcnow(),
            metadata=metadata or {}
        )
        self.messages.append(message)
        self.updated_at = datetime.utcnow()
    
    def get_recent_messages(self, count: int = 10) -> List[ConversationMessage]:
        """Get recent messages for context"""
        return self.messages[-count:] if self.messages else []
    
    def get_context_summary(self) -> Dict[str, Any]:
        """Get conversation summary for AI context"""
        if not self.messages:
            return {"message_count": 0, "topics": [], "last_interaction": None}
        
        # Extract key information
        topics = []
        user_intents = []
        
        for msg in self.messages:
            if msg.role == "user":
                # Simple keyword extraction for topics
                content_lower = msg.content.lower()
                if any(word in content_lower for word in ['booking', 'reservation', 'book']):
                    topics.append('booking')
                if any(word in content_lower for word in ['price', 'cost', 'rate', 'fee']):
                    topics.append('pricing')
                if any(word in content_lower for word in ['info', 'information', 'details', 'about']):
                    topics.append('information')
                if any(word in content_lower for word in ['cancel', 'change', 'modify', 'reschedule']):
                    topics.append('modification')
        
        return {
            "message_count": len(self.messages),
            "topics": list(set(topics)),
            "duration_minutes": (self.updated_at - self.created_at).total_seconds() / 60,
            "last_interaction": self.updated_at.isoformat(),
            "user_email": self.user_email,
            "business_id": self.business_id
        }

class ConversationService:
    """Service for managing conversation memory and context"""
    
    def __init__(self):
        # In-memory storage for demo (replace with Redis/Database in production)
        self._conversations: Dict[str, ConversationContext] = {}
        self._user_conversations: Dict[str, List[str]] = {}  # user_email -> conversation_ids
    
    def create_conversation(
        self, 
        user_email: Optional[str] = None, 
        business_id: Optional[str] = None,
        metadata: Dict[str, Any] = None
    ) -> str:
        """Create a new conversation"""
        conversation_id = str(uuid4())
        now = datetime.utcnow()
        
        conversation = ConversationContext(
            conversation_id=conversation_id,
            user_email=user_email,
            business_id=business_id,
            messages=[],
            created_at=now,
            updated_at=now,
            metadata=metadata or {}
        )
        
        self._conversations[conversation_id] = conversation
        
        # Track user conversations
        if user_email:
            if user_email not in self._user_conversations:
                self._user_conversations[user_email] = []
            self._user_conversations[user_email].append(conversation_id)
        
        logger.info(f"Created conversation {conversation_id} for user {user_email}")
        return conversation_id
    
    def get_conversation(self, conversation_id: str) -> Optional[ConversationContext]:
        """Get conversation by ID"""
        return self._conversations.get(conversation_id)
    
    def add_message(
        self, 
        conversation_id: str, 
        role: str, 
        content: str, 
        metadata: Dict[str, Any] = None
    ) -> bool:
        """Add message to conversation"""
        conversation = self._conversations.get(conversation_id)
        if not conversation:
            logger.warning(f"Conversation {conversation_id} not found")
            return False
        
        conversation.add_message(role, content, metadata)
        logger.debug(f"Added {role} message to conversation {conversation_id}")
        return True
    
    def get_conversation_history(
        self, 
        conversation_id: str, 
        message_count: int = 10
    ) -> List[Dict[str, str]]:
        """Get conversation history formatted for OpenAI"""
        conversation = self._conversations.get(conversation_id)
        if not conversation:
            return []
        
        recent_messages = conversation.get_recent_messages(message_count)
        return [
            {
                "role": msg.role,
                "content": msg.content
            }
            for msg in recent_messages
        ]
    
    def get_user_conversations(self, user_email: str) -> List[ConversationContext]:
        """Get all conversations for a user"""
        conversation_ids = self._user_conversations.get(user_email, [])
        return [
            self._conversations[conv_id] 
            for conv_id in conversation_ids 
            if conv_id in self._conversations
        ]
    
    def get_conversation_context(self, conversation_id: str) -> Dict[str, Any]:
        """Get rich context for AI processing"""
        conversation = self._conversations.get(conversation_id)
        if not conversation:
            return {}
        
        context = conversation.get_context_summary()
        
        # Add user history if available
        if conversation.user_email:
            user_conversations = self.get_user_conversations(conversation.user_email)
            context["user_history"] = {
                "total_conversations": len(user_conversations),
                "first_interaction": min(conv.created_at for conv in user_conversations).isoformat() if user_conversations else None,
                "is_returning_customer": len(user_conversations) > 1
            }
        
        return context
    
    def cleanup_old_conversations(self, days: int = 30):
        """Clean up conversations older than specified days"""
        cutoff = datetime.utcnow() - timedelta(days=days)
        
        to_remove = [
            conv_id for conv_id, conv in self._conversations.items()
            if conv.updated_at < cutoff
        ]
        
        for conv_id in to_remove:
            conv = self._conversations[conv_id]
            if conv.user_email and conv.user_email in self._user_conversations:
                self._user_conversations[conv.user_email] = [
                    cid for cid in self._user_conversations[conv.user_email] 
                    if cid != conv_id
                ]
            del self._conversations[conv_id]
        
        logger.info(f"Cleaned up {len(to_remove)} old conversations")
    
    def get_analytics(self) -> Dict[str, Any]:
        """Get conversation analytics"""
        total_conversations = len(self._conversations)
        total_messages = sum(len(conv.messages) for conv in self._conversations.values())
        
        # Active conversations (updated in last 24 hours)
        now = datetime.utcnow()
        day_ago = now - timedelta(days=1)
        active_conversations = sum(
            1 for conv in self._conversations.values() 
            if conv.updated_at > day_ago
        )
        
        # Average messages per conversation
        avg_messages = total_messages / total_conversations if total_conversations > 0 else 0
        
        return {
            "total_conversations": total_conversations,
            "total_messages": total_messages,
            "active_conversations_24h": active_conversations,
            "average_messages_per_conversation": avg_messages,
            "unique_users": len(self._user_conversations)
        }

# Singleton instance
_conversation_service = None

def get_conversation_service() -> ConversationService:
    """Get conversation service instance"""
    global _conversation_service
    if _conversation_service is None:
        _conversation_service = ConversationService()
    return _conversation_service
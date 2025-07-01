"""
Usage tracking and rate limiting service
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
from dataclasses import dataclass, asdict
from collections import defaultdict
import asyncio

from config.settings import get_settings

logger = logging.getLogger(__name__)

@dataclass
class UsageRecord:
    """Individual usage record"""
    user_id: Optional[str]
    business_id: Optional[str]
    endpoint: str
    tokens_used: int
    cost_estimate: float
    timestamp: datetime
    metadata: Dict[str, Any] = None

@dataclass
class RateLimitInfo:
    """Rate limit information"""
    requests_remaining: int
    reset_time: datetime
    total_requests: int
    window_seconds: int

class UsageTracker:
    """Track API usage and costs"""
    
    def __init__(self):
        self.settings = get_settings()
        # In-memory storage (replace with Redis/Database in production)
        self._usage_records: Dict[str, list] = defaultdict(list)  # user_id -> records
        self._rate_limits: Dict[str, Dict[str, Any]] = defaultdict(dict)  # user_id -> rate_limit_data
        
        # Token costs (per 1K tokens) - approximate OpenAI pricing
        self.token_costs = {
            "gpt-4": 0.03,      # Input tokens
            "gpt-4-output": 0.06,  # Output tokens
            "gpt-3.5-turbo": 0.002,
            "gpt-3.5-turbo-output": 0.002
        }
    
    def record_usage(
        self,
        user_id: Optional[str],
        business_id: Optional[str],
        endpoint: str,
        tokens_used: int,
        model: str = "gpt-4",
        metadata: Dict[str, Any] = None
    ) -> UsageRecord:
        """Record API usage"""
        
        # Calculate cost estimate
        cost_per_1k = self.token_costs.get(model, self.token_costs["gpt-4"])
        cost_estimate = (tokens_used / 1000) * cost_per_1k
        
        record = UsageRecord(
            user_id=user_id,
            business_id=business_id,
            endpoint=endpoint,
            tokens_used=tokens_used,
            cost_estimate=cost_estimate,
            timestamp=datetime.utcnow(),
            metadata=metadata or {}
        )
        
        # Store record
        key = user_id or business_id or "anonymous"
        self._usage_records[key].append(record)
        
        logger.debug(f"Recorded usage: {tokens_used} tokens, ${cost_estimate:.4f} for {key}")
        return record
    
    def get_usage_stats(
        self, 
        user_id: Optional[str] = None,
        business_id: Optional[str] = None,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get usage statistics"""
        
        key = user_id or business_id or "anonymous"
        records = self._usage_records.get(key, [])
        
        # Filter by date
        cutoff = datetime.utcnow() - timedelta(days=days)
        recent_records = [r for r in records if r.timestamp > cutoff]
        
        if not recent_records:
            return {
                "total_requests": 0,
                "total_tokens": 0,
                "total_cost": 0.0,
                "daily_average": 0,
                "period_days": days
            }
        
        total_requests = len(recent_records)
        total_tokens = sum(r.tokens_used for r in recent_records)
        total_cost = sum(r.cost_estimate for r in recent_records)
        daily_average = total_requests / days if days > 0 else 0
        
        # Endpoint breakdown
        endpoint_stats = defaultdict(lambda: {"requests": 0, "tokens": 0, "cost": 0.0})
        for record in recent_records:
            endpoint_stats[record.endpoint]["requests"] += 1
            endpoint_stats[record.endpoint]["tokens"] += record.tokens_used
            endpoint_stats[record.endpoint]["cost"] += record.cost_estimate
        
        return {
            "total_requests": total_requests,
            "total_tokens": total_tokens,
            "total_cost": round(total_cost, 4),
            "daily_average": round(daily_average, 2),
            "period_days": days,
            "endpoint_breakdown": dict(endpoint_stats),
            "first_request": min(r.timestamp for r in recent_records).isoformat(),
            "last_request": max(r.timestamp for r in recent_records).isoformat()
        }
    
    def cleanup_old_records(self, days: int = 90):
        """Clean up old usage records"""
        cutoff = datetime.utcnow() - timedelta(days=days)
        
        total_removed = 0
        for key in self._usage_records:
            original_count = len(self._usage_records[key])
            self._usage_records[key] = [
                r for r in self._usage_records[key] 
                if r.timestamp > cutoff
            ]
            removed = original_count - len(self._usage_records[key])
            total_removed += removed
        
        logger.info(f"Cleaned up {total_removed} old usage records")

class RateLimiter:
    """Rate limiting for API endpoints"""
    
    def __init__(self):
        self.settings = get_settings()
        # In-memory storage (replace with Redis in production)
        self._request_counts: Dict[str, Dict[str, Any]] = defaultdict(dict)
    
    async def check_rate_limit(
        self,
        user_id: Optional[str] = None,
        business_id: Optional[str] = None,
        endpoint: str = "default",
        requests_per_window: Optional[int] = None,
        window_seconds: Optional[int] = None
    ) -> RateLimitInfo:
        """Check if request is within rate limits"""
        
        # Use default limits if not specified
        requests_per_window = requests_per_window or self.settings.rate_limit_requests
        window_seconds = window_seconds or self.settings.rate_limit_window
        
        key = f"{user_id or business_id or 'anonymous'}:{endpoint}"
        now = datetime.utcnow()
        
        # Get current window data
        window_data = self._request_counts[key]
        window_start = window_data.get('window_start')
        request_count = window_data.get('count', 0)
        
        # Reset window if expired
        if not window_start or now - window_start > timedelta(seconds=window_seconds):
            window_start = now
            request_count = 0
        
        # Calculate remaining requests
        requests_remaining = max(0, requests_per_window - request_count)
        reset_time = window_start + timedelta(seconds=window_seconds)
        
        return RateLimitInfo(
            requests_remaining=requests_remaining,
            reset_time=reset_time,
            total_requests=request_count,
            window_seconds=window_seconds
        )
    
    async def record_request(
        self,
        user_id: Optional[str] = None,
        business_id: Optional[str] = None,
        endpoint: str = "default"
    ) -> bool:
        """Record a request and return True if within limits"""
        
        rate_limit_info = await self.check_rate_limit(user_id, business_id, endpoint)
        
        if rate_limit_info.requests_remaining <= 0:
            logger.warning(f"Rate limit exceeded for {user_id or business_id}:{endpoint}")
            return False
        
        # Record the request
        key = f"{user_id or business_id or 'anonymous'}:{endpoint}"
        now = datetime.utcnow()
        
        if key not in self._request_counts:
            self._request_counts[key] = {'window_start': now, 'count': 0}
        
        window_data = self._request_counts[key]
        
        # Reset window if needed
        if now - window_data['window_start'] > timedelta(seconds=self.settings.rate_limit_window):
            window_data['window_start'] = now
            window_data['count'] = 0
        
        window_data['count'] += 1
        
        logger.debug(f"Recorded request for {key}: {window_data['count']}/{self.settings.rate_limit_requests}")
        return True

class UsageService:
    """Combined usage tracking and rate limiting service"""
    
    def __init__(self):
        self.usage_tracker = UsageTracker()
        self.rate_limiter = RateLimiter()
    
    async def process_request(
        self,
        user_id: Optional[str] = None,
        business_id: Optional[str] = None,
        endpoint: str = "chat",
        tokens_used: int = 0,
        model: str = "gpt-4",
        metadata: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Process request with rate limiting and usage tracking"""
        
        # Check rate limits
        rate_limit_info = await self.rate_limiter.check_rate_limit(
            user_id, business_id, endpoint
        )
        
        if rate_limit_info.requests_remaining <= 0:
            return {
                "allowed": False,
                "error": "Rate limit exceeded",
                "rate_limit": {
                    "requests_remaining": rate_limit_info.requests_remaining,
                    "reset_time": rate_limit_info.reset_time.isoformat(),
                    "total_requests": rate_limit_info.total_requests
                }
            }
        
        # Record request
        allowed = await self.rate_limiter.record_request(user_id, business_id, endpoint)
        
        if not allowed:
            return {
                "allowed": False,
                "error": "Rate limit exceeded",
                "rate_limit": {
                    "requests_remaining": 0,
                    "reset_time": rate_limit_info.reset_time.isoformat(),
                    "total_requests": rate_limit_info.total_requests
                }
            }
        
        # Record usage if tokens were used
        usage_record = None
        if tokens_used > 0:
            usage_record = self.usage_tracker.record_usage(
                user_id, business_id, endpoint, tokens_used, model, metadata
            )
        
        return {
            "allowed": True,
            "rate_limit": {
                "requests_remaining": rate_limit_info.requests_remaining - 1,
                "reset_time": rate_limit_info.reset_time.isoformat(),
                "total_requests": rate_limit_info.total_requests + 1
            },
            "usage_record": asdict(usage_record) if usage_record else None
        }
    
    def get_usage_stats(
        self, 
        user_id: Optional[str] = None,
        business_id: Optional[str] = None,
        days: int = 30
    ) -> Dict[str, Any]:
        """Get usage statistics"""
        return self.usage_tracker.get_usage_stats(user_id, business_id, days)
    
    async def get_rate_limit_status(
        self,
        user_id: Optional[str] = None,
        business_id: Optional[str] = None,
        endpoint: str = "default"
    ) -> RateLimitInfo:
        """Get current rate limit status"""
        return await self.rate_limiter.check_rate_limit(user_id, business_id, endpoint)

# Singleton instance
_usage_service = None

def get_usage_service() -> UsageService:
    """Get usage service instance"""
    global _usage_service
    if _usage_service is None:
        _usage_service = UsageService()
    return _usage_service
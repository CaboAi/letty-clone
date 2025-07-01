#!/usr/bin/env python3
"""
Test script for CaboAi AI Service API
"""

import asyncio
import json
from typing import Dict, Any
import httpx

BASE_URL = "http://localhost:8000"

async def test_health():
    """Test health endpoint"""
    print("🏥 Testing health endpoint...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        print()

async def test_email_generation():
    """Test email generation endpoint"""
    print("📧 Testing email generation...")
    
    # Sample hotel booking inquiry
    email_request = {
        "email_content": "Hola, me gustaría reservar una habitación para dos personas del 15 al 20 de diciembre. ¿Tienen disponibilidad y cuáles son sus tarifas? Gracias.",
        "user_email": "test@example.com",
        "business_id": "hotel_cabo_paradise",
        "tone": "friendly",
        "industry": "hospitality",
        "language": "auto",
        "business_context": {
            "name": "Hotel Cabo Paradise",
            "location": "Medano Beach, Cabo San Lucas",
            "specialties": ["Beachfront location", "Ocean view rooms", "All-inclusive packages"],
            "contact": "reservations@caboparadise.com",
            "website": "www.caboparadise.com"
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/generate-email",
            json=email_request,
            timeout=30.0
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Generated Response:\n{result['response']}")
            print(f"\nConversation ID: {result['conversation_id']}")
            print(f"Tokens Used: {result['tokens_used']}")
            print(f"Language: {result['language']}")
            print(f"Success: {result['success']}")
            return result['conversation_id']
        else:
            print(f"Error: {response.text}")
            return None

async def test_conversation_history(conversation_id: str):
    """Test conversation history endpoint"""
    if not conversation_id:
        return
    
    print(f"💬 Testing conversation history for {conversation_id}...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/conversation/{conversation_id}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Messages: {len(result['messages'])}")
            print(f"Context: {json.dumps(result['context_summary'], indent=2)}")
        else:
            print(f"Error: {response.text}")
        print()

async def test_usage_stats():
    """Test usage statistics endpoint"""
    print("📊 Testing usage statistics...")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/usage-stats",
            params={"user_id": "test@example.com", "days": 1}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Total Requests: {result['total_requests']}")
            print(f"Total Tokens: {result['total_tokens']}")
            print(f"Total Cost: ${result['total_cost']}")
        else:
            print(f"Error: {response.text}")
        print()

async def test_rate_limit_status():
    """Test rate limit status endpoint"""
    print("⏱️ Testing rate limit status...")
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/rate-limit-status",
            params={"user_id": "test@example.com", "endpoint": "generate-email"}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Requests Remaining: {result['requests_remaining']}")
            print(f"Reset Time: {result['reset_time']}")
        else:
            print(f"Error: {response.text}")
        print()

async def test_different_scenarios():
    """Test different business scenarios"""
    scenarios = [
        {
            "name": "Real Estate Inquiry",
            "request": {
                "email_content": "Hi, I'm interested in purchasing a condo in Los Cabos for investment purposes. Can you tell me about properties available in the $500k-$800k range with rental potential?",
                "tone": "professional",
                "industry": "real_estate",
                "language": "en",
                "business_context": {
                    "name": "Cabo Real Estate Experts",
                    "specialties": ["Luxury condos", "Investment properties", "Rental management"]
                }
            }
        },
        {
            "name": "Tour Booking",
            "request": {
                "email_content": "¡Hola! Somos una familia de 4 personas y queremos hacer un tour de avistamiento de ballenas. ¿Cuándo es la mejor época y qué incluye el tour?",
                "tone": "casual",
                "industry": "tourism",
                "language": "auto",
                "business_context": {
                    "name": "Cabo Adventure Tours",
                    "specialties": ["Whale watching", "Snorkeling", "Sunset cruises"]
                }
            }
        }
    ]
    
    for scenario in scenarios:
        print(f"🎯 Testing {scenario['name']}...")
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BASE_URL}/generate-email",
                json=scenario['request'],
                timeout=30.0
            )
            if response.status_code == 200:
                result = response.json()
                print(f"Generated Response:\n{result['response']}")
                print(f"Language: {result['language']}")
                print()
            else:
                print(f"Error: {response.text}")
                print()

async def main():
    """Run all tests"""
    print("🚀 Starting CaboAi AI Service API Tests\n")
    
    try:
        # Basic health check
        await test_health()
        
        # Test email generation
        conversation_id = await test_email_generation()
        
        # Test conversation history
        await test_conversation_history(conversation_id)
        
        # Test usage stats
        await test_usage_stats()
        
        # Test rate limit status
        await test_rate_limit_status()
        
        # Test different scenarios
        await test_different_scenarios()
        
        print("✅ All tests completed!")
        
    except httpx.ConnectError:
        print("❌ Could not connect to the API. Make sure the server is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
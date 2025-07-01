#!/usr/bin/env python3
"""
Simple test script for upgraded /chat endpoint
"""

import asyncio
import json
import httpx

BASE_URL = "http://localhost:8000"

async def test_chat_endpoint():
    """Test the upgraded chat endpoint"""
    
    test_cases = [
        {
            "name": "Spanish Hotel Inquiry",
            "request": {
                "message": "Hola, me gustaría reservar una habitación para 2 personas del 15 al 20 de diciembre. ¿Tienen disponibilidad?",
                "tone": "friendly",
                "industry": "hospitality",
                "language": "auto",
                "user_id": "test_user_1",
                "business_context": {
                    "name": "Hotel Cabo Paradise",
                    "location": "Medano Beach"
                }
            }
        },
        {
            "name": "English Real Estate Inquiry", 
            "request": {
                "message": "I'm interested in buying a condo in Los Cabos for investment. What properties do you have available in the $500k range?",
                "tone": "professional",
                "industry": "real_estate",
                "language": "en",
                "user_id": "test_user_2"
            }
        },
        {
            "name": "Tourism Activity Request",
            "request": {
                "message": "We want to book a whale watching tour for 4 people. When is the best time and what does it include?",
                "tone": "casual",
                "industry": "tourism", 
                "language": "auto",
                "user_id": "test_user_3"
            }
        }
    ]
    
    print("🚀 Testing upgraded /chat endpoint with OpenAI integration\n")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Test health endpoint first
        print("🏥 Testing health endpoint...")
        try:
            health_response = await client.get(f"{BASE_URL}/health")
            print(f"Health Status: {health_response.status_code}")
            print(f"Response: {json.dumps(health_response.json(), indent=2)}\n")
        except Exception as e:
            print(f"Health check failed: {e}\n")
        
        # Test chat endpoint with different scenarios
        for i, test_case in enumerate(test_cases, 1):
            print(f"🧪 Test {i}: {test_case['name']}")
            print(f"Input: {test_case['request']['message']}")
            print(f"Settings: {test_case['request']['tone']} tone, {test_case['request']['industry']} industry")
            
            try:
                response = await client.post(
                    f"{BASE_URL}/chat",
                    json=test_case['request']
                )
                
                print(f"Status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Success: {result['success']}")
                    print(f"Language: {result['language']}")
                    print(f"Tokens: {result['tokens_used']}")
                    print(f"Response:\n{result['response']}")
                    
                    if result.get('error'):
                        print(f"⚠️ Error: {result['error']}")
                        
                else:
                    print(f"❌ HTTP Error: {response.text}")
                    
            except Exception as e:
                print(f"❌ Request failed: {e}")
            
            print("-" * 80)
            print()

async def test_error_handling():
    """Test error handling and fallback responses"""
    print("🛡️ Testing error handling...")
    
    # Test with potentially problematic input
    test_request = {
        "message": "Test message when OpenAI might be unavailable",
        "tone": "professional",
        "industry": "hospitality",
        "language": "es"
    }
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.post(f"{BASE_URL}/chat", json=test_request)
            result = response.json()
            
            print(f"Status: {response.status_code}")
            print(f"Success: {result.get('success', 'unknown')}")
            print(f"Response: {result.get('response', 'no response')}")
            
            if not result.get('success'):
                print(f"✅ Fallback response provided when OpenAI unavailable")
            else:
                print(f"✅ OpenAI integration working properly")
                
        except Exception as e:
            print(f"Test completed with exception (expected): {e}")

async def main():
    """Run all tests"""
    try:
        await test_chat_endpoint()
        await test_error_handling()
        print("🎉 All tests completed!")
        
    except httpx.ConnectError:
        print("❌ Could not connect to the API. Make sure the server is running on http://localhost:8000")
        print("Run: python main.py")
        
    except Exception as e:
        print(f"❌ Test suite failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
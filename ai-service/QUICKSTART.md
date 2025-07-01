# CaboAi AI Service - Quick Start Guide

## 🚀 Service Upgraded with OpenAI Integration

The `/chat` endpoint has been upgraded from placeholder responses to real OpenAI-powered intelligent responses.

## 📋 Prerequisites

1. **OpenAI API Key**: Get your API key from https://platform.openai.com/
2. **Python 3.11+**: Ensure you have Python installed
3. **Dependencies**: Install required packages

## ⚡ Quick Setup

### 1. Set Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your OpenAI API key
nano .env
```

**Minimum required in `.env`:**
```bash
OPENAI_API_KEY=your-openai-api-key-here
SECRET_KEY=your-secret-key-here
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the Service

```bash
python main.py
```

The service will start on `http://localhost:8000`

### 4. Test the Upgraded Endpoint

```bash
# Run the test script
python test_chat.py
```

## 🎯 New Chat Endpoint Features

### Enhanced Request Format

```json
POST /chat
{
  "message": "Hola, quiero reservar una habitación para 2 personas",
  "tone": "friendly",
  "industry": "hospitality", 
  "language": "auto",
  "user_id": "user123",
  "business_context": {
    "name": "Hotel Cabo Paradise",
    "location": "Medano Beach"
  }
}
```

### Enhanced Response Format

```json
{
  "response": "¡Hola! Muchas gracias por contactarnos...",
  "tone": "friendly",
  "industry": "hospitality",
  "language": "es",
  "conversation_id": "uuid-123",
  "tokens_used": 150,
  "success": true,
  "error": null
}
```

## 🏗️ Available Options

### Tone Types
- `professional`: Formal, business-appropriate
- `casual`: Friendly, approachable  
- `friendly`: Warm, enthusiastic

### Industry Types
- `hospitality`: Hotels, resorts, accommodations
- `real_estate`: Property sales, rentals
- `tourism`: Tours, activities, attractions
- `general`: General business inquiries

### Language Options
- `auto`: Automatic detection and matching
- `es`: Spanish responses
- `en`: English responses

## 🧪 Test Examples

### Hotel Booking (Spanish)
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, me gustaría reservar una habitación para 2 personas del 15 al 20 de diciembre",
    "tone": "friendly",
    "industry": "hospitality",
    "language": "auto"
  }'
```

### Real Estate Inquiry (English)
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am interested in buying a condo in Los Cabos for investment purposes",
    "tone": "professional", 
    "industry": "real_estate",
    "language": "en"
  }'
```

## 🛡️ Error Handling

The service includes comprehensive error handling:

- **Rate Limiting**: Prevents API abuse
- **OpenAI Failures**: Automatic fallback responses
- **Network Issues**: Graceful degradation
- **Invalid Inputs**: Proper validation and errors

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:8000/health
```

Returns:
```json
{
  "status": "healthy",
  "openai_available": true,
  "conversations": 0
}
```

### Usage Statistics
The service tracks:
- Token usage and costs
- Request rates and patterns
- Conversation analytics
- Error rates

## 🔧 Configuration

Key environment variables:

```bash
# OpenAI Settings
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Los Cabos Settings
TIMEZONE=America/Mazatlan
DEFAULT_LANGUAGE=es
SUPPORTED_LANGUAGES=["es", "en"]
```

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI API Key Invalid**
   ```
   Error: "Invalid API key"
   Solution: Check your OPENAI_API_KEY in .env
   ```

2. **Rate Limit Exceeded**
   ```
   Status: 429
   Solution: Wait for rate limit reset or upgrade OpenAI plan
   ```

3. **Module Import Errors**
   ```
   Error: "ModuleNotFoundError"
   Solution: pip install -r requirements.txt
   ```

4. **Service Unavailable**
   ```
   Error: Connection refused
   Solution: python main.py to start the service
   ```

## 🎉 Success!

If everything is working, you should see:
- ✅ Service starts without errors
- ✅ Health check returns "healthy"
- ✅ Chat endpoint returns intelligent responses
- ✅ Language detection works correctly
- ✅ Tone and industry context applied

Your CaboAi AI Service is now powered by OpenAI! 🚀
# CaboAi AI Service

Intelligent email generation service for Los Cabos businesses, powered by OpenAI GPT-4.

## Features

- **Intelligent Email Generation**: Context-aware email responses using OpenAI GPT-4
- **Multi-Industry Support**: Specialized prompts for hospitality, real estate, tourism, and restaurants
- **Bilingual Capability**: Automatic language detection and response in Spanish/English
- **Conversation Memory**: Tracks conversation context for personalized responses
- **Usage Tracking**: Monitor token usage, costs, and API statistics
- **Rate Limiting**: Configurable rate limits to control API usage
- **Los Cabos Expertise**: Built-in knowledge of local attractions, seasons, and business context

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```bash
OPENAI_API_KEY=your-openai-api-key-here
SECRET_KEY=your-secret-key-here
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Service

```bash
# Development mode
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Test the API

```bash
# Run test script
python test_api.py
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Core Endpoints

#### Generate Email Response
```http
POST /generate-email
```

Generate intelligent email responses with context awareness.

**Request Body:**
```json
{
  "email_content": "Hola, quiero reservar una habitación...",
  "user_email": "client@example.com",
  "business_id": "hotel_123",
  "tone": "friendly",
  "industry": "hospitality",
  "language": "auto",
  "business_context": {
    "name": "Hotel Cabo Paradise",
    "location": "Medano Beach",
    "specialties": ["Ocean view", "All-inclusive"]
  }
}
```

**Response:**
```json
{
  "response": "¡Hola! Gracias por contactarnos...",
  "conversation_id": "uuid-123",
  "tone": "friendly",
  "industry": "hospitality",
  "language": "es",
  "tokens_used": 150,
  "model": "gpt-4",
  "success": true,
  "rate_limit": {
    "requests_remaining": 99,
    "reset_time": "2024-01-01T12:00:00Z"
  }
}
```

#### Get Conversation History
```http
GET /conversation/{conversation_id}
```

Retrieve conversation history and context.

#### Usage Statistics
```http
GET /usage-stats?user_id=user@example.com&days=30
```

Get usage statistics including tokens, costs, and request counts.

#### Rate Limit Status
```http
GET /rate-limit-status?user_id=user@example.com
```

Check current rate limit status.

### Utility Endpoints

#### Health Check
```http
GET /health
```

Service health status with OpenAI connectivity check.

#### Root
```http
GET /
```

Basic service information.

## Configuration

### Industry Types

- `hospitality`: Hotels, resorts, accommodations
- `real_estate`: Property sales, rentals, investments
- `tourism`: Tours, activities, attractions
- `restaurant`: Dining, reservations, catering

### Tone Options

- `professional`: Formal, business-appropriate
- `casual`: Friendly, approachable
- `friendly`: Warm, enthusiastic

### Language Support

- `auto`: Automatic detection and matching
- `es`: Spanish responses
- `en`: English responses

## Business Context

The service includes specialized knowledge for Los Cabos businesses:

- **Seasonal Patterns**: Peak/low seasons, weather considerations
- **Local Attractions**: Arch of Cabo, Medano Beach, Land's End
- **Activities**: Deep-sea fishing, whale watching, golf, snorkeling
- **Transportation**: Airport transfers, local tours
- **Cultural Context**: Mexican hospitality, local customs

## Example Use Cases

### Hotel Booking Response

**Input:**
```
"Hola, me gustaría reservar una habitación para dos personas del 15 al 20 de diciembre."
```

**Generated Response:**
```
¡Hola! Muchas gracias por su interés en hospedarse con nosotros. 

Tenemos disponibilidad para dos personas del 15 al 20 de diciembre. Esta es una excelente época para visitar Los Cabos - el clima es perfecto y es temporada de avistamiento de ballenas.

Nuestras opciones incluyen:
- Habitación Deluxe con vista al mar: $280 USD por noche
- Suite con terraza privada: $380 USD por noche

Todas nuestras habitaciones incluyen desayuno, WiFi gratuito y acceso a nuestras instalaciones. También podemos ayudarle a organizar tours de avistamiento de ballenas y excursiones al famoso Arco de Cabo San Lucas.

¿Le gustaría que le envíe más información sobre nuestras habitaciones y servicios?

Saludos cordiales,
[Nombre del hotel]
```

### Real Estate Inquiry Response

**Input:**
```
"I'm interested in purchasing a condo in Los Cabos for investment purposes. Can you tell me about properties in the $500k-$800k range?"
```

**Generated Response:**
```
Hello! Thank you for your interest in Los Cabos real estate investment opportunities.

The $500k-$800k range offers excellent investment potential in Los Cabos, with properties that typically generate 6-8% annual rental yields. Here are some prime options:

**Medano Beach Area ($550k-$750k):**
- 2-3 bedroom condos with beach access
- Strong vacation rental demand
- Walking distance to restaurants and nightlife

**Corridor Properties ($500k-$700k):**
- Golf course communities
- Resort-style amenities
- Appreciation potential: 5-7% annually

**Investment Advantages:**
- Foreign ownership through bank trust (fideicomiso)
- Property management services available
- Year-round rental season
- Growing tourism market

I'd be happy to schedule a property tour and discuss financing options for international buyers. Our legal team can also explain the purchase process and requirements.

When would be a good time for a consultation?

Best regards,
[Agent name]
```

## Rate Limiting

Default rate limits:
- 100 requests per minute per user
- Configurable via environment variables
- Different limits can be set per endpoint

## Usage Tracking

The service tracks:
- Total requests and tokens used
- Estimated costs based on OpenAI pricing
- Usage by endpoint and time period
- Conversation analytics

## Deployment

### Production Environment

1. Set `ENVIRONMENT=production` in `.env`
2. Configure database and Redis for persistent storage
3. Set appropriate rate limits
4. Enable monitoring with Sentry DSN
5. Use multiple workers: `WORKERS=4`

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "main.py"]
```

### Railway Deployment

The service is configured for Railway deployment with `railway.json` configuration.

## Security

- API key authentication
- CORS configuration
- Rate limiting
- Input validation
- Error handling without data exposure

## Monitoring

- Health check endpoints
- Usage statistics
- Error logging
- OpenAI connectivity monitoring

## Development

### Adding New Industries

1. Add industry enum in `app/models/email_models.py`
2. Create prompts in `app/services/prompt_templates.py`
3. Update business logic as needed

### Adding New Languages

1. Update language enum and settings
2. Add language detection logic
3. Create language-specific templates

## Support

For issues and feature requests, please check the project documentation or contact the development team.

## License

This project is proprietary software for CaboAi business operations.
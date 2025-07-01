from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI(title="CaboAi AI Service")

class ChatMessage(BaseModel):
    message: str
    tone: str = "professional"

@app.get("/")
async def root():
    return {"message": "CaboAi AI Service is running!", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/chat")
async def chat(chat_message: ChatMessage):
    # Simple response for now - can add OpenAI later
    return {
        "response": f"AI Response (tone: {chat_message.tone}): {chat_message.message}",
        "tone": chat_message.tone
    }

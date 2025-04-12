# ai.py

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from services.ai_chat import AIChatService
from typing import Optional

router = APIRouter()
chat_service = AIChatService()

class ChatRequest(BaseModel):
    prompt: str
    conversation_id: Optional[str] = None

@router.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint working"}

@router.post("/ask")
async def ask_question(request: ChatRequest):
    try:
        response, conversation_id = await chat_service.get_response(
            request.prompt,
            request.conversation_id
        )
        return {
            "response": response,
            "conversation_id": conversation_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

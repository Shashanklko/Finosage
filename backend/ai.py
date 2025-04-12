# ai.py

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from services.ai_chat import AIChatService

router = APIRouter()
chat_service = AIChatService()

class ChatRequest(BaseModel):
    prompt: str

@router.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint working"}

@router.post("/ask")
async def ask_question(request: ChatRequest):
    try:
        response = await chat_service.get_response(request.prompt)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

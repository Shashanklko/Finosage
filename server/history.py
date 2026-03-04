from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from typing import List, Optional, Any
import jwt
from bson import ObjectId
from config import settings
from database import get_db

router = APIRouter()

# ---------- models ----------
class HistorySaveRequest(BaseModel):
    token: str
    module: str  # e.g., "retirement", "portfolio", "goal"
    name: str    # Custom name for the analysis
    data: Any    # The full simulation result JSON

class HistoryItem(BaseModel):
    id: str
    module: str
    name: str
    timestamp: datetime
    data: Any

# ---------- helper ----------
def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------- endpoints ----------
@router.post("/save")
async def save_history(req: HistorySaveRequest):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    user_id = verify_token(req.token)
    
    history_entry = {
        "userId": ObjectId(user_id),
        "module": req.module,
        "name": req.name,
        "timestamp": datetime.now(timezone.utc),
        "data": req.data
    }
    
    result = await db.history.insert_one(history_entry)
    
    return {
        "success": True, 
        "id": str(result.inserted_id),
        "message": "Analysis saved to your history."
    }

@router.get("/")
async def get_history(token: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    user_id = verify_token(token)
    
    cursor = db.history.find({"userId": ObjectId(user_id)}).sort("timestamp", -1)
    history = []
    async for doc in cursor:
        history.append({
            "id": str(doc["_id"]),
            "module": doc["module"],
            "name": doc.get("name", "Untitled Analysis"),
            "timestamp": doc["timestamp"],
            "data": doc["data"]
        })
    
    return {"history": history}

@router.delete("/{history_id}")
async def delete_history(history_id: str, token: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    user_id = verify_token(token)
    
    result = await db.history.delete_one({
        "_id": ObjectId(history_id),
        "userId": ObjectId(user_id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found or unauthorized")
    
    return {"success": True, "message": "Analysis deleted from history."}

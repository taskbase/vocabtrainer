import httpx
import sys
from fastapi import APIRouter, HTTPException
from os import path
from pydantic import BaseModel
from typing import Any, List

sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))
from settings import settings

router = APIRouter()

url = "https://www.chatbase.co/api/v1"

class Chat(BaseModel):
    messages: List[Any]
    chatbotId: str
    stream: bool
    temperature: float
    model: str
    conversationId: str

@router.get("/api/chat/get-chatbots")
def get_chatbots():
    headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
    timeout = httpx.Timeout(10)
    response = httpx.get(url=url + "/get-chatbots", headers=headers, timeout=timeout)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    chatbots = response.json()['chatbots']['data']
    return chatbots

@router.post("/api/chat")
def chat(request: Chat):
    headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
    timeout = httpx.Timeout(60)
    response = httpx.post(url=url + "/chat", headers=headers, json=request.dict(), timeout=timeout)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    response_data = response.json()
    if "text" in response_data:
        return {"message": response_data["text"]}
    else:
        raise HTTPException(status_code=500, detail="Invalid response from external service")

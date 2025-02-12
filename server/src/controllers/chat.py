import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from aitutor.agent import ai_tutor_chat_call as ai_tutor_chat_call
from app_settings import settings
from models import Message
from aitutor.configuration import get_chat_config
from aitutor.models import ChatConfig, PublicChatConfig

router = APIRouter()

chatbase_url = "https://www.chatbase.co/api/v1"


class ChatRequest(BaseModel):
    messages: List[Message]
    chatbotId: str
    stream: bool
    temperature: float
    model: str
    conversationId: str


@router.get("/api/chat/get-chatbots")
def get_chatbots():
    return _get_chatbase_configs()


def _get_chatbase_configs():
    headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
    timeout = httpx.Timeout(10)
    response = httpx.get(url=chatbase_url + "/get-chatbots", headers=headers, timeout=timeout)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    chat_bot_dicts = response.json()['chatbots']['data']
    return [
        PublicChatConfig(
            id=src["id"],
            name=src["name"],
            initial_messages=src["initial_messages"]
        ) for src in chat_bot_dicts]


@router.post("/api/chat")
def chat(request: ChatRequest):
    # Check if there is a matchin AI Tutor configuration
    chat_config = get_chat_config(request.chatbotId)
    if chat_config:
        response = ai_tutor_chat_call(
            request.messages[-1],
            request.conversationId,
            chat_config
        )
        return {"message": response["response"]}
    else:
        # Chatbase case
        headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
        timeout = httpx.Timeout(60)
        response = httpx.post(url=url + "/chat", headers=headers, json=request.dict(), timeout=timeout)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        response_data = response.json()
        return {"message": response_data["text"]}


@router.get("/api/chat-config/{chat_id}")
def chat_config(chat_id: str):
    config: Optional[ChatConfig] = get_chat_config(chat_id)
    if config is None:
        chatbase_config = next((config for config in _get_chatbase_configs() if config.id == chat_id), None)
        if not chatbase_config:
            raise HTTPException(status_code=404, detail=f"Chat config not found for chat_id: {chat_id}")
        else:
            return chatbase_config
    else:
        return config.to_public()

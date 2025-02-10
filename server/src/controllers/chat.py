import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, List
from aitutor.agent import ai_tutor_chat_call as ai_tutor_chat_call
from app_settings import settings
from typing import Optional
from models import Message

router = APIRouter()

url = "https://www.chatbase.co/api/v1"


class ChatRequest(BaseModel):
    messages: List[Message]
    chatbotId: str
    stream: bool
    temperature: float
    model: str
    conversationId: str
    tenantIds: List[int]


class ChatDefinition(BaseModel):
    id: str
    name: str
    messages: List[Message]
    chatbotId: str
    stream: bool
    temperature: float
    model: str
    conversationId: str
    initial_messages: List[str]


grammar_trainer = ChatDefinition(
    id="grammar_trainer",
    name="Grammar Trainer",
    messages=[],
    chatbotId="grammar_trainer",
    stream=False,
    temperature=0,
    model="",
    conversationId="",
    initial_messages=[
        "Hi!"
    ],
)


@router.get("/api/chat/get-chatbots")
def get_chatbots():
    headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
    timeout = httpx.Timeout(10)
    response = httpx.get(url=url + "/get-chatbots", headers=headers, timeout=timeout)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    chatbots = response.json()['chatbots']['data']
    chatbots.append(grammar_trainer)
    return chatbots


@router.post("/api/chat")
def chat(request: ChatRequest):
    if request.chatbotId == grammar_trainer.chatbotId:
        print(f"conversation id: {request.conversationId}")
        response = ai_tutor_chat_call(request.messages[-1], request.conversationId, request.tenantIds)
        return {"message": response["response"]}
    else:
        headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
        timeout = httpx.Timeout(60)
        response = httpx.post(url=url + "/chat", headers=headers, json=request.dict(), timeout=timeout)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        response_data = response.json()
        return {"message": response_data["text"]}

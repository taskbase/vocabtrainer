import httpx
import json
import sys
from fastapi import APIRouter, HTTPException
from typing import Any, Dict
from fastapi.logger import logger
from os import path
import requests
import logging
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

@router.get("/api/chatbase/get-chatbots")
def get_chatbots():
    headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
    timeout = httpx.Timeout(10)
    response = httpx.get(url=url + "/get-chatbots", headers=headers, timeout=timeout)
    logging.info(f"response: {response.text}")
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    chatbots = response.json()['chatbots']['data']
    logging.info(f"response: {chatbots}")
    return chatbots

@router.post("/api/chatbase/chat")
def chat(request: Chat):
    headers = {"accept": "application/json", "Authorization": f"Bearer {settings.chatbase_api_key}"}
    timeout = httpx.Timeout(60)
    logging.info(f"request: {request}")
    logging.info(f"request dict: {request.dict()}")
    response = httpx.post(url=url + "/chat", headers=headers, json=request.dict(), timeout=timeout)
    if response.status_code != 200:
        logging.info("did not return 200")
        raise HTTPException(status_code=response.status_code, detail=response.text)
    response_data = response.json()
    logging.info(f"response: {response_data}")
    if "text" in response_data:
        return {"message": response_data["text"]}
    else:
        raise HTTPException(status_code=500, detail="Invalid response from external service")


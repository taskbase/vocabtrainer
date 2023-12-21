import httpx
import json
import sys
from fastapi import APIRouter, HTTPException
from typing import Any, Dict
from fastapi.logger import logger
from os import path

sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))
from settings import settings

router = APIRouter()

url = f"{settings.feedback_api_url}/feedback/compute"
headers: Dict[str, Any] = {"Authorization": f"Bearer {settings.api_key}"}


@router.post("/api/feedback/compute")
def compute_feedback(request: dict):
    request["feedbackEngine"]["tenantId"] = settings.tenant_id
    # Nasty hack as the analytics engine only returns masteries for this user
    # Note: the bearer token used to request from the analytics engine needs to belong to this user
    request["feedbackEngine"]["userId"] = settings.vocabtrainer_user

    timeout = httpx.Timeout(30)
    response = httpx.post(url=url, headers=headers, json=request, timeout=timeout)

    try:
        json_response = response.json()
    except json.decoder.JSONDecodeError as e:
        logger.error(f"The result returned from the feedback API was not a valid JSON: {str(e)}")
        raise HTTPException(status_code=500, detail="The result returned from the feedback API was not a JSON.")
    if not (200 <= response.status_code < 300):
        raise HTTPException(status_code=response.status_code, detail=json_response)
    return json_response


def get_fake_task_request(task_id: str, message: str):
    return {
        "format": "text",
        "meta": {
        },
        "feedbackEngine": {
            "feedbackId": f"{task_id}",
            "userId": "<user id>",
            "tenantId": "99",
            "timeOnTask": 0
        },
        "instruction": "",
        "type": "essay",
        "sampleSolution": "",
        "answer": {
            "text": f"{message}"
        }
    }


@router.post("/api/feedback/off-topic-filter")
def filters(request: dict):
    # general filter task
    filter_task_id = settings.off_topic_filter_task

    # skip if not configured
    if filter_task_id == "":
        return []

    remote_headers: Dict[str, Any] = {"Authorization": f"Bearer {settings.api_key}"}
    timeout = httpx.Timeout(30)
    try:
        response = httpx.post(url, headers=remote_headers, timeout=timeout,
                              json=get_fake_task_request(filter_task_id, request["message"]))
        positive_feedback = list(filter(lambda f: f["correctness"] == "CORRECT", response.json()["feedback"]))
        return positive_feedback
    except Exception as e:
        print(e)

    return []

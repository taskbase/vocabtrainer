import json

from fastapi import APIRouter, HTTPException
from typing import Any, Dict
from fastapi.logger import logger

from settings import settings
import httpx

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



# def get_fake_task_request(task_id: str, message: str):
#     return {
#         "format": "text",
#         "meta": {
#         },
#         "feedbackEngine": {
#             "feedbackId": f"{task_id}",
#             "userId": "<user id>",
#             "tenantId": "99",
#             "timeOnTask": 0
#         },
#         "instruction": "",
#         "type": "essay",
#         "sampleSolution": "",
#         "answer": {
#             "text": f"{message}"
#         }
#     }

#@router.post("/api/feedback/hacks")
# def filters(request: dict):
#     tasks = {
#         "bullshit": "aAk14uhGibt7xiZ78wFhtZ",
#         "help": "9ZrKp7cJzKOa3wdTsWJJSZ",
#         "theory": "4gt0xrzcJPu7q6gwyOAbOA",
#         "early": "1aguJBiSWv89V7fICXsnQD",
#         # this task does not work well with the initial `yes` input by the user
#         #"skip": "C58gcaiXIj95mU6JMbhwA",
#         "flirt": "4vji1aRS0588Bd9QAgwuow"
#     }
#
#     feedback = []
#
#     for task in tasks:
#         task_id = tasks[task]
#
#         # We should use `url`. However, to avoid the need to getting again a new prod dump, we'll use this one here
#         remote_url = "https://bitmark-api.taskbase.com/feedback/compute"
#         remote_headers: Dict[str, Any] = {"Authorization": f"Bearer {settings.prod_api_key}"}
#
#         response = httpx.post(remote_url, headers=remote_headers, json=get_fake_task_request(task_id, request["message"]))
#
#         try:
#             positive_feedback = list(filter(lambda f: f["correctness"] == "CORRECT", response.json()["feedback"]))
#             feedback = feedback + positive_feedback
#         except Exception as e:
#             print(e)
#
#     return feedback

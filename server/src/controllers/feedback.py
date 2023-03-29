from fastapi import APIRouter
from typing import Any, Dict

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
    request["feedbackEngine"]["userId"] = "root@taskbase.com"

    response = httpx.post(url=url, headers=headers, json=request)

    return response.json()


# def get_fake_task_request(task_id: str, message: str):
#     return {
#         "format": "text",
#         "meta": {
#         },
#         "feedbackEngine": {
#             "feedbackId": f"{task_id}",
#             "userId": "root@taskbase.com",
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

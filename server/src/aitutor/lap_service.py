import requests

from aitutor.models import Task
from app_settings import settings

def fetch_tasks(offset=0, limit=100, tenant_ids=None, task_types=None):
    """
    Fetch the tasks using the native LAP API.
    :param offset: Where to start.
    :param limit: How many tasks to fetch.
    :param tenant_ids: Tenants from which to fetch the tasks from.
    :param task_types: Task Types to fetch, defaults to OPEN.
    :return: List of tasks in JSON format.
    """
    if task_types is None:
        task_types = ["OPEN"]
    if tenant_ids is None:
        tenant_ids = [128, 157]
    task_list_url = f"{settings.lap_host}/api/task/filtered"
    data = {
        "tenantIds": tenant_ids,
        "taskTypeList": task_types,
        "offset": offset,
        "limit": limit,
    }
    response = requests.post(task_list_url, headers=headers(), json=data)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Request failed with status code {response.status_code}: {response.text}")


def feedback(task: Task, answer: str, student_id: str):
    """
    Call the public Feedback API: https://developers.taskbase.com/apis/specification/feedback/computefeedbackbytaskid
    :param task: The task that the student was challenged with.
    :param answer: The student's answer.
    :param student_id: The identifier of the student.
    :return: The feedback object in JSON format.
    """
    feedback_api_url = f"{settings.lap_api_host}/tasks/{task.id}/feedback/compute"
    data = {
        "userId": student_id,
        "tenantId": task.tenant_id,
        "taskType": "FREEFORM_TEXT",
        "answer": {
            "content": answer
        }
    }
    response = requests.post(feedback_api_url, headers=headers(), json=data)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Request failed with status code {response.status_code}: {response.text}")


def headers():
    return {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {settings.lap_token}",
    }

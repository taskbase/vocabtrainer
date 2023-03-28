from fastapi import APIRouter, Response
from typing import Any, Dict
from settings import settings
import httpx
import numpy as np

from .task import topics

router = APIRouter()


def all_competences():
    url = f"{settings.analytics_api_url}/api/competence"
    headers: Dict[str, Any] = {"Authorization": f"Bearer {settings.api_key}"}

    response = httpx.get(url=url, headers=headers)

    return response.json()


# initial computation is disabled, as for the MVP we don't connect to the analytics engine.
# competences = all_competences()
# word_competence_id_map = dict(map(lambda c: (c["name"].lower(), c["id"]), all_competences()))

word_competence_id_map = {}


def all_masteries():
    url = f"{settings.analytics_api_url}/api/mastery"
    headers: Dict[str, Any] = {"Authorization": f"Bearer {settings.api_key}"}

    body = {"competence_ids": list(map(lambda c: c["id"], all_competences()))}

    response = httpx.post(url=url, headers=headers, json=body)

    return response.json()

def get_mastery_for_topic(topic: str, masteries: any):
    def sigmoid(x):
        return 1.0 / (1.0 + np.exp(-x))

    words = topics[topic]
    len_words = len(words)
    mastery = 0

    for word in words:
        try:
            competence_id = str(word_competence_id_map[word.lower()])

            mastery = mastery + sigmoid(masteries[competence_id] or 0)
        except Exception as e:
            print(e)
            # Skip this word
            len_words = len_words - 1

    return mastery / len_words


# @router.post("/api/mastery")
# def get_masteries():
#     masteries = all_masteries()
#
#     print(masteries)
#
#     return {
#         "FOOD_DRINKS": get_mastery_for_topic("FOOD_DRINKS", masteries),
#         "WORK": get_mastery_for_topic("WORK", masteries),
#         "PRESENT_SIMPLE": get_mastery_for_topic("PRESENT_SIMPLE", masteries)
#     }

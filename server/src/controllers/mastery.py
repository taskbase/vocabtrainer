from fastapi import APIRouter
from typing import Any, Dict
from settings import settings
import httpx

from .task import topics

router = APIRouter()


def all_competences():
    url = f"{settings.analytics_api_url}/api/competence"
    headers: Dict[str, Any] = {"Authorization": f"Bearer {settings.api_key}"}

    response = httpx.get(url=url, headers=headers)

    return response.json()


competences = all_competences()

word_competence_id_map = dict(map(lambda c: (c["name"].lower(), c["id"]), all_competences()))


def all_masteries():
    url = f"{settings.analytics_api_url}/api/mastery"
    headers: Dict[str, Any] = {"Authorization": f"Bearer {settings.api_key}"}

    body = {"competence_ids": list(map(lambda c: c["id"], all_competences()))}

    response = httpx.post(url=url, headers=headers, json=body)

    return response.json()


@router.get("/api/competences")
def get_competences():
    return all_competences()


def get_mastery_for_topic(topic: str, masteries: any):
    words = topics[topic]

    mastery = 0

    len_words = len(words)

    for word in words:
        try:
            competence_id = str(word_competence_id_map[word.lower()])
            mastery = mastery + (masteries[competence_id] or 0)
        except:
            # Skip this word
            len_words = len_words - 1

    return mastery / len_words


@router.get("/api/mastery")
def get_masteries():
    masteries = all_masteries()

    print(masteries)
    print(word_competence_id_map)

    return {
        "FOOD_DRINKS": get_mastery_for_topic("FOOD_DRINKS", masteries),
        "WORK": get_mastery_for_topic("WORK", masteries),
        "PRESENT_SIMPLE": get_mastery_for_topic("PRESENT_SIMPLE", masteries)
    }

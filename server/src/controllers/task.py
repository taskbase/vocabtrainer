from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import random

router = APIRouter()

topics = {
    "FOOD_DRINKS": [
        "dinner",
        "alcohol",
        "apple",
        "banana",
        "tree",
        "beer",
        "bread",
        "chemistry",
        "diet",
        "egg",
        "ice",
        "food",
        "meat",
        "breakfast",
        "vegetables",
        "coffee",
        "cheese",
        "cook",
        "spoon",
        "oil",
    ],
    "WORK": [
        "attorney",
        "work",
        "work",
        "physician",
        "task",
        "author",
        "bank",
        "cash",
        "build",
        "profession",
        "office",
        "computer",
        "experience",
        "success",
        "salary",
        "captain",
        "quality",
        "job",
        "looking",
        "dentist",
        "science",
    ],
    "PRESENT_SIMPLE": [
        "change",
        "work",
        "mean",
        "pray",
        "stay",
        "think",
        "expect",
        "fly",
        "believe",
        "cost",
        "live",
        "rule",
        "is",
        "speak",
        "wear",
        "earn",
        "understand",
        "grow",
        "want",
        "pay"
    ]
}

user_stats = []


class RecommendRequest(BaseModel):
    topic: str
    user_id: str


def get_task(word: str, exercise_type: str = "all"):
    base_url = "https://taskpool.taskbase.com"

    url = f"{base_url}/exercises?word={word}&translationPair=de->en&exerciseType={exercise_type}"

    try:
        return httpx.get(url).json()
    except:
        return None


@router.get("/api/task/overview/")
def get_task_overview():
    return topics


@router.post("/api/task/recommend")
def recommend_task(request: RecommendRequest):
    words = []
    try:
        words = topics[request.topic]
    except:
        raise HTTPException(status_code=400, detail=f"Topic '{request.topic}' not supported")

    index = random.randint(0, len(words) - 1)
    word = words[index]

    print(get_task(word))
    # TODO: select a certain index
    return get_task(word)[0]

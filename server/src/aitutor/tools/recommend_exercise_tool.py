import json
import logging
import random
from typing import Optional

import yake
from aitutor.configuration import chat_config
from aitutor.configuration import resolve_runnable_config_param
from aitutor.models import Task
from aitutor.rag import get_rag_store
from cachetools import TTLCache
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool

# Create a TTLCache with expiration
history = TTLCache(maxsize=10000, ttl=24 * 60 * 60)


@tool(parse_docstring=True)
def recommend_exercise_tool(topic: str, config: RunnableConfig) -> Optional[Task]:
    """Recommends the most relevant exercise based on the given topic.

    This function searches for the most relevant exercise related to the provided topic
    and returns a corresponding exercise if available.

    Args:
        topic (str): The topic for which a relevant exercise is needed.
        config (RunnableConfig): The runtime configuration.

    Returns:
        Optional[Task]: The most relevant exercise if found, otherwise None.
    """
    tenant_ids = chat_config(config=config).tenant_ids
    lap_token = chat_config(config=config).lap_token
    user_id = resolve_runnable_config_param(key="user_id", config=config)

    rag_store = get_rag_store(lap_token=lap_token, tenant_ids=tenant_ids)
    docs = rag_store.similarity_search(query=topic, k=20)
    for doc in docs:
        # Extract the task
        task = json_to_task(json.loads(doc.page_content))
        # Make sure the user does not get a task they already saw.
        if not _has_solved(user_id, task.id):
            _add_solved_task(user_id=user_id, task_id=task.id)
            logging.info(f"recommended task: %s", task)
            return task
    return None


def _add_solved_task(user_id: int, task_id: str):
    """Add a task id to the set of solved tasks"""
    if user_id not in history:
        history[user_id] = set()  # Initialize set if not present
    history[user_id].add(task_id)


def _has_solved(user_id: int, task_id: str) -> bool:
    """Check if a user has solved a task."""
    return task_id in history.get(user_id, set())


@tool(parse_docstring=True)
def get_list_of_topics(topic: Optional[str], config: RunnableConfig) -> list[str]:
    """Get a list of topics that the chatbot has exercises for.

    Extracts a list of keywords related to a given topic using an approximate document retrieval method.

    Args:
        topic (Optional[str]): The topic the student wants to learn something about.
        config (RunnableConfig): The runtime configuration.

    Returns:
        List[str]: A list of extracted keywords that are most relevant to the topic.
    """
    tenant_ids = chat_config(config=config).tenant_ids
    lap_token = chat_config(config=config).lap_token
    rag_store = get_rag_store(lap_token=lap_token, tenant_ids=tenant_ids)
    if topic:
        # Get a sample of documents
        docs = rag_store.similarity_search(topic, k=20)
        tasks = [json_to_task(json.loads(doc.page_content)) for doc in docs]
    else:
        # Retrieve random documents
        doc_count = rag_store.index.ntotal
        num_samples = min(100, doc_count)
        random_indices = random.sample(range(doc_count), num_samples)
        docs = [rag_store.similarity_search_by_vector(rag_store.index.reconstruct(idx), k=1)[0] for idx in
                random_indices]
        tasks = [json_to_task(json.loads(doc.page_content)) for doc in docs]

    text_corpus = " ".join([f"{task.title} {task.description}" for task in tasks])
    if len(tasks) > 0 and tasks[0].language:
        language = tasks[0].language.lower()
    else:
        language = "en"
    kw_extractor = yake.KeywordExtractor(lan=language, top=12)
    keywords = kw_extractor.extract_keywords(text_corpus)
    return keywords


def json_to_task(task_json) -> Task:
    return Task(
        id=task_json["id"],
        title=task_json["title"],
        description=task_json["description"],
        sample_solutions=task_json["sampleSolutions"],
        tenant_id=task_json["tenant"]["id"],
        language=task_json.get("language")
    )

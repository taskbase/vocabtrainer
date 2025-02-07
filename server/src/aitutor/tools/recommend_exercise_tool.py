import json
from typing import Optional

from langchain_community.vectorstores import FAISS
from langchain_core.tools import tool
from langchain_openai import OpenAIEmbeddings
import yake
import random

from aitutor.models import Task


class UserTaskHistory:
    def __init__(self):
        self.data = {}

    def add_id(self, user_id: str, id: str):
        """Adds an id to the user's set."""
        if user_id not in self.data:
            self.data[user_id] = set()
        self.data[user_id].add(id)

    def has_id(self, user_id: str, id: str) -> bool:
        """Checks if a user already has a given id."""
        return id in self.data.get(user_id, set())


embedding = OpenAIEmbeddings()
rag_store = FAISS.load_local("task_index", embeddings=embedding, allow_dangerous_deserialization=True)
history = UserTaskHistory()


@tool(parse_docstring=True)
def recommend_exercise_tool(topic: str, student_id: str) -> Optional[Task]:
    """Recommends the most relevant exercise based on the given topic.

    This function searches for the most relevant exercise related to the provided topic
    and returns a corresponding exercise if available.

    Args:
        topic (str): The topic for which a relevant exercise is needed.
        student_id (str): The identifier of the student requesting the exercise.

    Returns:
        Optional[Task]: The most relevant exercise if found, otherwise None.
    """
    docs = rag_store.similarity_search(query=topic, k=20)
    for doc in docs:
        # Extract the task
        task = json_to_task(json.loads(doc.page_content))
        # Make sure the user does not get a task they already saw.
        if not history.has_id(student_id, task.id):
            history.add_id(user_id=student_id, id=task.id)
            return task
    return None


@tool(parse_docstring=True)
def get_list_of_topics(topic: Optional[str]) -> list[str]:
    """Get a list of topics that the chatbot has exercises for.

    Extracts a list of keywords related to a given topic using an approximate
    document retrieval method.

    Args:
        topic (Optional[str]): An optional string representing the topic for which keywords need to be extracted.

    Returns:
        List[str]: A list of extracted keywords that are most relevant to the topic.
    """
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
    if len(tasks) > 0:
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
        language=task_json["language"]
    )

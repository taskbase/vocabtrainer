import json
import langchain_openai
import langchain_community.vectorstores
from cachetools import TTLCache

from aitutor.lap_service import fetch_tasks

# Initialize embedding model
embedding = langchain_openai.OpenAIEmbeddings()

# Create a TTLCache with maxsize 100 and items expiring after 1 day
rag_cache = TTLCache(maxsize=100, ttl=24*60*60)

def get_rag_store(lap_token: str, tenant_ids: list[int]):
    cache_key = ",".join(map(str, tenant_ids))
    cached_store = rag_cache.get(cache_key)
    if cached_store:
        return cached_store
    else:
        tasks = fetch_tasks(lap_token=lap_token, offset=0, limit=1000, tenant_ids=tenant_ids, task_types=["OPEN"])
        task_documents = [json.dumps(task) for task in tasks]
        rag_store = langchain_community.vectorstores.FAISS.from_texts(task_documents, embedding)
        rag_cache[cache_key] = rag_store
    return rag_store

def warmup_rag_store(lap_token: str, tenant_ids: list[int]):
    get_rag_store(lap_token=lap_token, tenant_ids=tenant_ids)
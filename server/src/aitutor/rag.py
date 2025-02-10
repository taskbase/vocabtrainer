import json
import langchain_openai
import langchain_community.vectorstores

from aitutor.lap_service import fetch_tasks

# Initialize embedding model
embedding = langchain_openai.OpenAIEmbeddings()



def get_rag_store(tenant_ids: list[int]):
    tasks = fetch_tasks(limit=1000, tenant_ids=tenant_ids)
    print(f"Fetched {len(tasks)} tasks.")
    task_documents = [json.dumps(task) for task in tasks]
    rag_store = langchain_community.vectorstores.FAISS.from_texts(task_documents, embedding)
    return rag_store

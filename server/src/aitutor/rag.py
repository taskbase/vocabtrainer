import json
import langchain_openai
import langchain_community.vectorstores

from controllers.aitutor.lap_service import fetch_tasks

# Initialize embedding model
embedding = langchain_openai.OpenAIEmbeddings()


def get_rag_store():
    tasks = fetch_tasks(limit=1000)
    task_documents = [json.dumps(task) for task in tasks]
    rag_store = langchain_community.vectorstores.FAISS.from_texts(task_documents, embedding)
    return rag_store

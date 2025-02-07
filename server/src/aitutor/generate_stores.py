import json
import langchain_openai
import langchain_community.vectorstores

from controllers.aitutor.lap_service import fetch_tasks

# Fetch the tasks from the LAP server
tasks = fetch_tasks(limit=1000)
print(f"Fetched {len(tasks)} tasks.")
task_documents = [json.dumps(task) for task in tasks]

for task in task_documents:
    print(f"{task}")

# Initialize embedding model
embedding = langchain_openai.OpenAIEmbeddings()

# Create FAISS index from documents
rag_store = langchain_community.vectorstores.FAISS.from_texts(task_documents, embedding)

# Save the FAISS index to disk for later use
rag_store.save_local("task_index")

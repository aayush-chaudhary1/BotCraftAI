import requests
import os

BASE_URL = "http://localhost:8000"

def upload_document(file_path):
    url = f"{BASE_URL}/upload-documents"
    with open(file_path, "rb") as f:
        files = {"files": (os.path.basename(file_path), f)}
        response = requests.post(url, files=files)
        print("Upload Response:", response.json())

def query_rag(question):
    url = f"{BASE_URL}/query"
    payload = {"query": question}
    response = requests.post(url, json=payload)
    print("Query:", question)
    data = response.json()
    print("Answer:", data.get("answer"))
    print("Sources:", data.get("sources"))
    print("-" * 30)

if __name__ == "__main__":
    # Create a dummy test file if not exists
    if not os.path.exists("test_doc.txt"):
        with open("test_doc.txt", "w") as f:
            f.write("The capital of France is Paris. The Eiffel Tower is in Paris.")
    
    print("Uploading document...")
    upload_document("test_doc.txt")
    
    print("\nQuerying...")
    query_rag("What is the capital of France?")
    query_rag("Where is the Eiffel Tower?")

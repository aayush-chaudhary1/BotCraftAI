from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from app.services.vector_store import vector_store_service
from app.services.llm import llm_service
from app.core.config import settings

class RAGPipeline:
    def __init__(self):
        self.vector_store_service = vector_store_service
        self.llm = llm_service.get_llm()

    def get_qa_chain(self, collection_name: str = None):
        if collection_name is None:
            collection_name = settings.COLLECTION_NAME
            
        vector_store = self.vector_store_service.get_vector_store(collection_name)
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})

        prompt_template = """Use the following pieces of context to answer the question at the end. 
if you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Answer:"""
        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": PROMPT}
        )
        return qa_chain

    def answer_question(self, question: str, collection_name: str = None):
        if collection_name is None:
            collection_name = settings.COLLECTION_NAME
            
        qa_chain = self.get_qa_chain(collection_name)
        result = qa_chain.invoke({"query": question})
        return result

rag_pipeline = RAGPipeline()

from langchain_core.runnables import RunnableConfig
from pydantic import BaseModel, Field
from typing_extensions import Optional, Any


class Task(BaseModel):
    id: str = Field(description="Id of the task")
    title: str = Field(description="Task the user was challenged with.")
    description: str = Field(description="The answer the student provided.")
    sample_solutions: list[str] = Field(description="The sample solutions for the task.")
    tenant_id: int = Field(description="Tenant of the task.")
    language: Optional[str] = Field(description="Language of the task.")


class Criteria(BaseModel):
    isCorrect: bool
    message: str
    aspect: str
    description: str
    context: str


class Feedback(BaseModel):
    criteria: list[Criteria]


class PublicChatConfig(BaseModel):
    id: str
    name: str
    initial_messages: list[str]


class ChatConfig(BaseModel):
    id: str
    name: str
    tenant_ids: list[int]
    lap_token: str
    system_message: str
    initial_messages: list[str]

    def to_public(self) -> PublicChatConfig:
        return PublicChatConfig(
            id=self.id,
            name=self.name,
            initial_messages=self.initial_messages
        )


class Configuration(BaseModel):
    chat_configurations: list[ChatConfig]

from pydantic import BaseModel, Field


class Task(BaseModel):
    id: str = Field(description="Id of the task")
    title: str = Field(description="Task the user was challenged with.")
    description: str = Field(description="The answer the student provided.")
    sample_solutions: list[str] = Field(description="The sample solutions for the task.")
    tenant_id: int = Field(description="Tenant of the task.")
    language: str = Field(description="Language of the task.")


class Criteria(BaseModel):
    isCorrect: bool
    message: str
    aspect: str
    description: str
    context: str


class Feedback(BaseModel):
    criteria: list[Criteria]

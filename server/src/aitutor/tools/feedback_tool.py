from aitutor.lap_service import feedback
from aitutor.models import Task, Feedback, Criteria
from aitutor.configuration import resolve_runnable_config_param, chat_config
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool


@tool(parse_docstring=True)
def get_feedback_tool(
    task: Task,
    answer: str,
    config: RunnableConfig
) -> Feedback:
    """A feedback generation engine providing students with helpful feedback.

    Useful for evaluating student answers in exercises.

    Args:
        task (Task): The task the user was challenged with.
        answer (str): The answer the student provided.
        config (RunnableConfig): The runtime configuration.

    Returns:
        Feedback: The feedback for the student's answer broken down into criteria.
    """
    user_id = resolve_runnable_config_param(key="user_id", config=config)
    lap_token = chat_config(config).lap_token

    feedback_result = feedback(
        lap_token=lap_token,
        task=task,
        answer=answer,
        student_id=user_id
    )
    feedback_object = to_feedback(feedback_result)
    return feedback_object


def to_feedback(feedback_result) -> Feedback:
    criteria_list = [Criteria(
        isCorrect=item["correctness"] == "CORRECT",
        message=item["message"],
        aspect=item["aspects"][0]["name"],
        description=item["aspects"][0]["description"],
        context=item["context"][0]["content"],
    ) for item in feedback_result["result"]["feedback"]]
    return Feedback(criteria=criteria_list)

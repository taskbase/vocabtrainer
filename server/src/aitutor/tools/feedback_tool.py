from langchain_core.tools import tool

from aitutor.models import Task, Feedback, Criteria
from aitutor.lap_service import feedback


@tool(parse_docstring=True)
def get_feedback_tool(
        task: Task,
        answer: str,
        student_id: str,
) -> Feedback:
    """A feedback generation engine providing students with helpful feedback.

    Useful for evaluating student answers in exercises.

    Args:
        task (Task): The task the user was challenged with.
        answer (str): The answer the student provided.
        student_id (int): The student identifier.

    Returns:
        Feedback: The feedback for the student's answer broken down into criteria.
    """
    feedback_result = feedback(
        task=task,
        answer=answer,
        student_id=student_id
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

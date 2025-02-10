from typing import Annotated

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage, HumanMessage, BaseMessage
from langgraph.checkpoint.memory import MemorySaver, logger
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from pydantic import BaseModel
from typing_extensions import TypedDict
from aitutor.tools.feedback_tool import get_feedback_tool
from aitutor.tools.recommend_exercise_tool import recommend_exercise_tool, get_list_of_topics
from models import Message


# Define input model
class ChatRequest(BaseModel):
    message: str


class State(TypedDict):
    messages: Annotated[list, add_messages]
    tenant_ids: List[int]


tools = [get_feedback_tool, recommend_exercise_tool, get_list_of_topics]

llm = ChatAnthropic(model="claude-3-5-sonnet-20240620")
llm_with_tools = llm.bind_tools(tools)


def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}


memory = MemorySaver()

# Default state

# class TutorState(BaseModel):
#     messages: list
#
# initial_state = TutorState(messages=[SystemMessage(content=system_prompt)])

graph_builder = StateGraph(State)

# The first argument is the unique node name
# The second argument is the function or object that will be called whenever the node is used.
graph_builder.add_node("chatbot", chatbot)
tool_node = ToolNode(tools=tools)
graph_builder.add_node("tools", tool_node)

graph_builder.add_conditional_edges(
    "chatbot",
    tools_condition,
)

# Any time a tool is called, we return to the chatbot to decide the next step
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile(checkpointer=memory)

print(f"INITIALIZE GRAPH")

system_prompt = (
    "You are an interactive AI tutor. You ask the student what they want to learn and challenge them with exercises. "
    "You provide feedback for the student's answers. "
    "If the student answers incorrectly, offer helpful hints instead of direct answers. "
    "After any clarification, always return to the exercise to keep the learning experience interactive and engaging. "
    "Only use the tool for generating exercises. "
    "Always respond in the same language as the exercises."
)

def ai_tutor_chat_call_inner(message: BaseMessage, user_config, tenant_ids: Optional[List[int]]):
    """Handles user input and returns AI response."""
    if(tenant_ids):
        graph.update_state(user_config, {"tenant_ids": tenant_ids})
    if message.type == "human":
        role = "user"
    else:
        role = "ai"
    events = graph.stream(
        {"messages": [{"role": role, "content": message.content }]},
        user_config,
        stream_mode="values",
    )
    response_messages = []
    for event in events:
        # logger.info("Event details: %s", event)
        response_messages.append(event["messages"][-1].content)
    return {"response": response_messages[-1] if response_messages else "No response generated."}

def ai_tutor_chat_call(message: Message, user_id: str, tenant_ids: List[int]):
    user_config = {"configurable": {"thread_id": user_id}}
    snapshot = graph.get_state(user_config)
    print(f"snapshot: {snapshot}")
    systemMessage = SystemMessage(
        content=system_prompt
    )
    if snapshot.values.get("messages") is None:
        print("STATE IS EMPTY!!")
        ai_tutor_chat_call_inner(systemMessage, user_config, tenant_ids)
    return ai_tutor_chat_call_inner(HumanMessage(message.content), user_config)

# def input_chat(user_input: str, role: str = "user"):
#     events = graph.stream(
#         {"messages": [{"role": role, "content": user_input}]},
#         config,
#         stream_mode="values",
#     )
#     for event in events:
#         event["messages"][-1].pretty_print()
#
#
# input_chat("Hallo")
#
# while True:
#     user_input = input("User: ")
#     if user_input.lower() in ["quit", "exit", "q"]:
#         print("Goodbye!")
#         break
#     input_chat(user_input)

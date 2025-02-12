from typing import Annotated, Optional

from aitutor.rag import warmup_rag_store
from aitutor.tools.feedback_tool import get_feedback_tool
from aitutor.tools.recommend_exercise_tool import recommend_exercise_tool, get_list_of_topics
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage, HumanMessage, BaseMessage
from langchain_core.runnables import RunnableConfig
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from models import Message
from pydantic import BaseModel
from typing_extensions import TypedDict
from aitutor.models import ChatConfig
import logging

# Set logging level
logging.basicConfig(level=logging.INFO)


# Define input model
class ChatRequest(BaseModel):
    message: str


class State(TypedDict):
    messages: Annotated[list, add_messages]


tools = [get_feedback_tool, recommend_exercise_tool, get_list_of_topics]

llm = ChatAnthropic(model="claude-3-5-sonnet-20240620")
llm_with_tools = llm.bind_tools(tools)

system_prompt = (
    "You are an interactive AI tutor. You ask the student what they want to learn and challenge them with exercises. "
    "You provide feedback for the student's answers. "
    "If the student answers incorrectly, offer helpful hints instead of direct answers. "
    "After any clarification, always return to the exercise to keep the learning experience interactive and engaging. "
    "Only use the tool for generating exercises. "
    "Always respond in the same language as the exercises."
)


def chatbot(state: State, config: RunnableConfig):
    if not state["messages"] or not isinstance(state["messages"][0], SystemMessage):
        state["messages"].insert(0, SystemMessage(content=system_prompt))  # Ensure system message exists
    return {"messages": [llm_with_tools.invoke(state["messages"], config=config)]}


memory = MemorySaver()

graph_builder = StateGraph(State)

# The first argument is the unique node name
# The second argument is the function or object that will be called whenever the node is used.
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("tools", ToolNode(tools=tools))

graph_builder.add_conditional_edges(
    "chatbot",
    tools_condition,
)

# Any time a tool is called, we return to the chatbot to decide the next step
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
graph = graph_builder.compile(checkpointer=memory)


def stream_message(message: str, config: RunnableConfig):
    """Handles user input and returns AI response."""
    events = graph.stream(
        {"messages": [{"role": "human", "content": message}]},
        config,
        stream_mode="values",
    )
    response_messages = []
    for event in events:
        logging.info("Event details: %s", event)
        response_messages.append(event["messages"][-1].content)
    return {"response": response_messages[-1] if response_messages else "No response generated."}


def ai_tutor_chat_call(message: Message, user_id: str, chat_config: ChatConfig):
    warmup_rag_store(lap_token=chat_config.lap_token, tenant_ids=chat_config.tenant_ids)
    config = {"configurable": {"thread_id": user_id, "user_id": user_id, "chat_config": chat_config}}
    # snapshot = graph.get_state(config)
    return stream_message(message.content, config)

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

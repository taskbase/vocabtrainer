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
from aitutor.configuration import chat_config
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


def chatbot(state: State, config: RunnableConfig):
    if not state["messages"] or not isinstance(state["messages"][0], SystemMessage):
        # System message must be the first message.
        state["messages"].insert(0, SystemMessage(content=chat_config(config).system_message))
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
        response_messages.append(event["messages"][-1].content)
    return {"response": response_messages[-1] if response_messages else "No response generated."}


def ai_tutor_chat_call(message: Message, user_id: str, chat_config: ChatConfig):
    warmup_rag_store(lap_token=chat_config.lap_token, tenant_ids=chat_config.tenant_ids)
    config = {"configurable": {"thread_id": user_id, "user_id": user_id, "chat_config": chat_config}}
    return stream_message(message.content, config)

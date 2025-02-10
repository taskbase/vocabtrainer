export interface GetChatbotsResponse {
  chatbots: Chatbot[]
}

export interface Chatbot {
  id: string,
  name: string,
  initial_messages: string[]
}

export interface Chat {
  messages: any[],
  chatbotId: string,
  stream: false,
  temperature: 0,
  model: "gpt-4o-mini",
  conversationId: string,
  tenantIds: number[]
}

export interface ChatResponse {
  message: string
}

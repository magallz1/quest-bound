export type ChatMessage = {
  role: 'assistant' | 'user' | 'system';
  content: string;
};

export type ChatRequest = {
  messages: ChatMessage[];
};

export type ChatResponse = {
  messages: ChatMessage[];
};

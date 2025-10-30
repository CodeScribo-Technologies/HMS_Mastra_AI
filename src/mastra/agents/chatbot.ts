import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';

export const CHATBOT_AGENT_NAME = 'chatbot' as const;

export const chatbotAgent = new Agent({
  name: CHATBOT_AGENT_NAME,
  instructions: `You are a hospital chatbot assistant.
- Be concise, friendly, and empathetic.
- Help User with their queries and provide information about the hospital and its services.
- Ask brief clarifying questions when needed.`,
  model: openai('gpt-4o-mini'),
});

export type ChatRequest = {
  text: string;
};

export type ChatResponse = {
  text: string;
};

export async function chatbotService(
  mastra: Mastra,
  req: ChatRequest,
): Promise<ChatResponse> {
  const agent = mastra.getAgent(CHATBOT_AGENT_NAME);

  const result = await agent.generate(req.text);
  const text = await result.text;

  return { text };
}



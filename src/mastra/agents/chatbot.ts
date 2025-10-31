import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';
import { Memory } from '@mastra/memory';
import { dbQueryTool } from '../../tools/dbQueryTool';

export const CHATBOT_AGENT_NAME = 'chatbot' as const;

export const chatbotAgent = new Agent({
  name: CHATBOT_AGENT_NAME,
  instructions: `You are a hospital chatbot assistant.
 - Be concise, friendly, and empathetic.
 - Help User with their queries and provide information about the hospital and its services.
 - Ask brief clarifying questions when needed.
 - You can use the "run_postgres_query" tool to fetch real data from the hospital database.
 - Only use this tool for factual data from the database.
 - Important: All database table names are plural (e.g., use plural nouns). Do not guess singular table names.
 - When composing SQL, avoid semicolons and always include a reasonable LIMIT.`,
  model: openai('gpt-4o-mini'),
  tools: { run_postgres_query: dbQueryTool },
  memory: new Memory({
    options: { lastMessages: 20 },
  }),
});

export type ChatRequest = {
  text: string;
  memory?: { resource?: string; thread?: string };
};

export type ChatResponse = {
  text: string;
};

export async function chatbotService(
  mastra: Mastra,
  req: ChatRequest,
): Promise<ChatResponse> {
  const agent = mastra.getAgent(CHATBOT_AGENT_NAME);

  const execOptions = (req.memory && req.memory.resource && req.memory.thread)
    ? { memory: { resource: req.memory.resource, thread: req.memory.thread } }
    : undefined;

  const result = await agent.generate(req.text, execOptions);
  const text = await result.text;

  return { text };
}



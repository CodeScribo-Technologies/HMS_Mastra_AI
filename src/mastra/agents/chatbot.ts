import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';
import { Memory } from '@mastra/memory';
import { visitQueryTool } from '../../tools/visitQueryTool';

export const CHATBOT_AGENT_NAME = 'chatbot' as const;

export const chatbotAgent = new Agent({
  name: CHATBOT_AGENT_NAME,
  instructions: `You are a patient visit chatbot assistant.
 - Be brief, concise, and friendly.
 - Answer only what the user asks. Do not suggest follow-up questions or future actions.
 - Do not provide examples of what to ask next.
 - Answer questions about patient visits and related visit information.
 - Use the "run_visit_query" tool to fetch data. Check the tool description for available tables.
 - Do not mention specific table names or column names in your responses unless the user explicitly asks for them.
 - If a query fails because a column doesn't exist, explain what you tried and ask the user for the exact table and column name or specify another table to search.
 - If asked about non-visit data, inform that you only help with patient visit information and suggest contacting the appropriate department.
 - Keep responses short and to the point.`,
  model: openai('gpt-5-nano'),
  tools: { run_visit_query: visitQueryTool },
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



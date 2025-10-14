import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';

export const IDENTIFY_AGENT_NAME = 'identify' as const;


export const identifyAgent = new Agent({
  name: IDENTIFY_AGENT_NAME,
  instructions: `You are given a list of field names and a paragraph from a user. Understand the paragraph and fill each field with the value found in that paragraph.
Return ONLY a JSON object that maps each provided field name to a string. If a field is not present in the paragraph, return an empty string for that field. Do not include extra keys or any non-JSON text.`,
  model: openai('gpt-4o-mini'),
});

export type IdentifyRequest = {
  fields: string[];
  paragraph: string;
};

export async function identifyService(
  mastra: Mastra,
  req: IdentifyRequest,
): Promise<{ mapping: Record<string, string> }> {
  const agent = mastra.getAgent(IDENTIFY_AGENT_NAME);
  const prompt = `Fields: ${JSON.stringify(req.fields)}\nParagraph: ${req.paragraph}`;
  const result = await agent.generate(prompt);
  const text = await result.text;

  const parsed = safeParseJsonObject(text);
  return { mapping: coerceToFieldMapping(req.fields, parsed) };
}

function safeParseJsonObject(maybeJson: string): Record<string, unknown> {
  try {
    return JSON.parse(maybeJson);
  } catch {
    const match = maybeJson.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {};
      }
    }
    return {};
  }
}

function coerceToFieldMapping(
  fields: string[],
  raw: Record<string, unknown>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    const v = raw && typeof raw === 'object' ? (raw as any)[f] : undefined;
    out[f] = typeof v === 'string' ? v : '';
  }
  return out;
}



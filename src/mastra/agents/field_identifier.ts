import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';

export const IDENTIFY_AGENT_NAME = 'identify' as const;


export const fieldIdentifierAgent = new Agent({
  name: IDENTIFY_AGENT_NAME,
  instructions: `You will receive a nested form object (form) along with a paragraph. Understand the paragraph and fill values for the provided form structure.
Return ONLY JSON with exactly the provided keys and nested structure. All leaf values must be strings. If a value is not present in the paragraph, return an empty string. Do not include any extra keys or any non-JSON text.`,
  model: openai('gpt-4o-mini'),
});

export type FieldIdentifierRequest = {
  form: Record<string, unknown>;
  paragraph: string;
};

export async function fieldIdentifierService(
  mastra: Mastra,
  req: FieldIdentifierRequest,
): Promise<{ mapping: Record<string, unknown> }> {
  const agent = mastra.getAgent(IDENTIFY_AGENT_NAME);
  const prompt = `Form: ${JSON.stringify(req.form)}\nParagraph: ${req.paragraph}`;
  const result = await agent.generate(prompt);
  const text = await result.text;

  const parsed = ParseJsonObject(text);
  return { mapping: parsed };
}

function ParseJsonObject(maybeJson: string): Record<string, unknown> {
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

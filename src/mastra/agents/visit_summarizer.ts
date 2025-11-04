import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';

export const VISIT_SUMMARIZER_NAME = 'visit-summarizer' as const;

export const visitSummarizerAgent = new Agent({
  name: VISIT_SUMMARIZER_NAME,
  instructions: `Medical visit summarizer. Analyze complete patient visit data and create professional clinical summary.

Extract medical essentials: vital signs, complaints, examination findings, diagnoses, medications, investigations ordered, and treatments.

Exclude billing, pricing, discounts, packages, and administrative details.

Return ONLY valid JSON:
{
  "summary": "Professional clinical detailed summary covering: patient presentation, vital signs, relevant history, examination findings, diagnosis, medications prescribed, investigations ordered, and treatment plan."
}

Output valid JSON only.`,
  model: openai('gpt-5-nano'),
});

export type VisitSummarizerRequest = Record<string, unknown>;

export type VisitSummarizerResponse = {
  summary: string;
};

export async function visitSummarizerService(
  mastra: Mastra,
  req: VisitSummarizerRequest,
): Promise<VisitSummarizerResponse> {
  const agent = mastra.getAgent(VISIT_SUMMARIZER_NAME);
  
  const prompt = `Patient Visit Data:
${JSON.stringify(req, null, 2)}

Analyze this complete visit and create professional clinical summary.`;
  
  const result = await agent.generate(prompt);
  const text = await result.text;

  const parsed = ParseJsonObject(text);
  return parsed as VisitSummarizerResponse;
}

function ParseJsonObject(maybeJson: string): VisitSummarizerResponse {
  try {
    return JSON.parse(maybeJson);
  } catch {
    const match = maybeJson.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {
          summary: 'Unable to generate summary from provided data.',
        };
      }
    }
    return {
      summary: 'Unable to generate summary from provided data.',
    };
  }
}


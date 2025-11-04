import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';

export const REPORT_COMPARATOR_NAME = 'report-comparator' as const;

export const reportComparatorAgent = new Agent({
  name: REPORT_COMPARATOR_NAME,
  instructions: `Medical report comparator. Compare two medical reports and identify key differences.

Report ONLY clinically significant changes. Focus on changes in diagnoses, symptoms, vitals, labs, medications, and treatments.
Ignore formatting and non-medical details.

Return JSON only:
{
  "keyDiffs": "1. ...\n2. ...\n3. ..."
}

Make points concise, numbered, and medically relevant.`,
  model: openai('gpt-5-nano'),
});

export type ReportComparatorRequest = {
  sourceText: string;
  targetText: string;
};

export type ReportComparatorResponse = {
  keyDiffs: string;
};

export async function reportComparatorService(
  mastra: Mastra,
  req: ReportComparatorRequest,
): Promise<ReportComparatorResponse> {
  const agent = mastra.getAgent(REPORT_COMPARATOR_NAME);
  
  const prompt = `Compare these two medical reports and identify key differences:

SOURCE (Old Report):
${req.sourceText}

TARGET (New Report):
${req.targetText}

Identify medically significant differences and list them as numbered points.`;
  
  const result = await agent.generate(prompt);
  const text = await result.text;

  const parsed = ParseJsonObject(text);
  return parsed as ReportComparatorResponse;
}

function ParseJsonObject(maybeJson: string): ReportComparatorResponse {
  try {
    return JSON.parse(maybeJson);
  } catch {
    const match = maybeJson.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {
          keyDiffs: 'Unable to compare reports. Please check if reports contain valid medical data.',
        };
      }
    }
    return {
      keyDiffs: 'Unable to compare reports. Please check if reports contain valid medical data.',
    };
  }
}


import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';

export const PRESCRIPTION_VALIDATOR_NAME = 'prescription-validator' as const;

export const prescriptionValidatorAgent = new Agent({
  name: PRESCRIPTION_VALIDATOR_NAME,
  instructions: `You are a prescription validator for a given patient context.

Using the provided patient context and the proposed prescription details, write a brief doctor-facing paragraph (3–5 sentences):
- State if the medication is appropriate for this patient.
- Provide a clear recommendation and final verdict.

Return ONLY JSON:
{ "status": "short label summarizing safety", "analysis": "short paragraph with recommendation and final verdict" }

Do not include any text outside the JSON object.`,
  model: openai('gpt-4o-mini'),
});

export type PrescriptionValidatorRequest = Record<string, unknown>;

export type PrescriptionValidatorResponse = {
  status: string;
  analysis: string;
};

export async function prescriptionValidatorService(
  mastra: Mastra,
  req: PrescriptionValidatorRequest,
): Promise<PrescriptionValidatorResponse> {
  const agent = mastra.getAgent(PRESCRIPTION_VALIDATOR_NAME);

  const prompt = `Patient + Prescription:\n${JSON.stringify(req, null, 2)}\n\nAnalyze and provide a short paragraph with a final verdict.`;

  const result = await agent.generate(prompt);
  const text = await result.text;

  const parsed = ParseJsonObject(text);
  return parsed as PrescriptionValidatorResponse;
}

function ParseJsonObject(maybeJson: string): PrescriptionValidatorResponse {
  try {
    return JSON.parse(maybeJson);
  } catch {
    const match = maybeJson.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {
          status: 'unknown',
          analysis: 'Unable to analyze with the provided data.',
        };
      }
    }
    return {
      status: 'unknown',
      analysis: 'Unable to analyze with the provided data.',
    };
  }
}



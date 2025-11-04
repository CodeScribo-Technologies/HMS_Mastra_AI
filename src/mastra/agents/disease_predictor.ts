import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import type { Mastra } from '@mastra/core';

export const PREDICT_AGENT_NAME = 'predict' as const;

export const diseasePredictorAgent = new Agent({
  name: PREDICT_AGENT_NAME,
  instructions: `You are a Medical AI assistant. Analyze patient data (vital signs, medical/surgical history, symptoms) and predict top 2 diseases.

Consider: patient vital signs, symptom patterns, medical history relevance, and illness duration.

Return ONLY valid JSON:
{
  "predictions": [
    {
      "disease": "Disease Name",
      "reason": "Brief explanation why predicted based on patient data",
      "solution": "Treatment recommendations and suggestions for possible tests, labs, or imaging studies"
    }
  ]
}

Sort by most likely first. Output valid JSON only.`,
  model: openai('gpt-5-nano'),
});

export type Prediction = {
  disease: string;
  reason: string;
  solution: string;
};

export type DiseasePredictorRequest = Record<string, unknown>;

export type DiseasePredictorResponse = {
  predictions: Prediction[];
};

export async function diseasePredictorService(
  mastra: Mastra,
  req: DiseasePredictorRequest,
): Promise<DiseasePredictorResponse> {
  const agent = mastra.getAgent(PREDICT_AGENT_NAME);
  
  const prompt = `Patient Information:
${JSON.stringify(req, null, 2)}

Analyze this patient data and predict diseases.`;
  
  const result = await agent.generate(prompt);
  const text = await result.text;

  const parsed = ParseJsonObject(text);
  return parsed as DiseasePredictorResponse;
}

function ParseJsonObject(maybeJson: string): DiseasePredictorResponse {
  try {
    return JSON.parse(maybeJson);
  } catch {
    const match = maybeJson.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return {
          predictions: [],
        };
      }
    }
    return {
      predictions: [],
    };
  }
}


import { Mastra } from '@mastra/core';
import { fieldIdentifierAgent } from './agents/field_identifier.js';
import { diseasePredictorAgent } from './agents/disease_predictor.js';
import { visitSummarizerAgent } from './agents/visit_summarizer.js';
import fieldIdentifierRoute from './routes/field_identifier_route.js';
import diseasePredictorRoute from './routes/disease_predictor_route.js';
import visitSummarizerRoute from './routes/visit_summarizer_route.js';

export const mastra = new Mastra({
  agents: {
    identify: fieldIdentifierAgent,
    predict: diseasePredictorAgent,
    'visit-summarizer': visitSummarizerAgent,
  },
  server: {
    apiRoutes: [fieldIdentifierRoute, diseasePredictorRoute, visitSummarizerRoute],
  },
})
        
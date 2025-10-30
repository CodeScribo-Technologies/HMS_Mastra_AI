import { Mastra } from '@mastra/core';
import { fieldIdentifierAgent } from './agents/field_identifier.js';
import { diseasePredictorAgent } from './agents/disease_predictor.js';
import { visitSummarizerAgent } from './agents/visit_summarizer.js';
import { reportComparatorAgent } from './agents/report_comparator.js';
import { prescriptionValidatorAgent } from './agents/prescription_validator.js';
import { chatbotAgent } from './agents/chatbot';
import { LibSQLStore } from '@mastra/libsql';
import fieldIdentifierRoute from './routes/field_identifier_route.js';
import diseasePredictorRoute from './routes/disease_predictor_route.js';
import visitSummarizerRoute from './routes/visit_summarizer_route.js';
import reportComparatorRoute from './routes/report_comparator_route.js';
import prescriptionValidatorRoute from './routes/prescription_validator_route.js';
import chatRoute from './routes/chatbot_route';

export const mastra = new Mastra({
  storage: new LibSQLStore({
    url: ':memory:',
  }),
  agents: {
    identify: fieldIdentifierAgent,
    predict: diseasePredictorAgent,
    'visit-summarizer': visitSummarizerAgent,
    'report-comparator': reportComparatorAgent,
    'prescription-validator': prescriptionValidatorAgent,
    'chatbot': chatbotAgent,
  },
  server: {
    apiRoutes: [fieldIdentifierRoute, diseasePredictorRoute, visitSummarizerRoute, reportComparatorRoute, prescriptionValidatorRoute, chatRoute],
  },
})
        
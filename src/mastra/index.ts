
import { Mastra } from '@mastra/core';
import { fieldIdentifierAgent } from './agents/field_identifier.js';
import fieldIdentifierRoute from './routes/field_identifier_route.js';

export const mastra = new Mastra({
  agents: {
    identify: fieldIdentifierAgent,
  },
  server: {
    apiRoutes: [fieldIdentifierRoute],
  },
})
        

import { Mastra } from '@mastra/core';
import { identifyAgent } from './agents/basic.js';
import identifyRoute from './routes/identify.js';

export const mastra = new Mastra({
  agents: {
    identify: identifyAgent,
  },
  server: {
    apiRoutes: [identifyRoute],
  },
})
        
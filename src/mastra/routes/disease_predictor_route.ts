import { diseasePredictorService, type DiseasePredictorRequest } from '../agents/disease_predictor.js';

export const diseasePredictorRoute = {
  path: '/disease-predictor',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      try {
        const body = await c.req.json() as DiseasePredictorRequest;
        
        if (!body || typeof body !== 'object') {
          return c.json({ error: 'Body must be a valid object' }, 400);
        }

        const result = await diseasePredictorService(mastra, body);
        return c.json({ result });
      } catch (error) {
        return c.json({ error: 'Invalid JSON body' }, 400);
      }
    };
  },
} as const;

export default diseasePredictorRoute;


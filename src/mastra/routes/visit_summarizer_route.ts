import { visitSummarizerService, type VisitSummarizerRequest } from '../agents/visit_summarizer.js';

export const visitSummarizerRoute = {
  path: '/visit-summarizer',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      try {
        const body = await c.req.json() as VisitSummarizerRequest;
        
        if (!body || typeof body !== 'object') {
          return c.json({ error: 'Body must be a valid object' }, 400);
        }

        const result = await visitSummarizerService(mastra, body);
        return c.json({ result });
      } catch (error) {
        return c.json({ error: 'Invalid JSON body' }, 400);
      }
    };
  },
} as const;

export default visitSummarizerRoute;


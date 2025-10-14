import { identifyService } from '../agents/basic.js';
export const identifyRoute = {
  path: '/api/identify',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      const body = await c.req.json().catch(() => ({} as any));
      const fields = (body as any)?.fields as string[] | undefined;
      const paragraph = (body as any)?.paragraph as string | undefined;
      if (!Array.isArray(fields) || typeof paragraph !== 'string') {
        return c.json({ error: 'Body must include fields: string[] and paragraph: string' }, 400);
      }

      const { mapping } = await identifyService(mastra, { fields, paragraph });
      return c.json({ result: mapping });
    };
  },
} as const;

export default identifyRoute;



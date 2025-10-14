import { identifyService } from '../agents/field_identifier';
export const fieldIdentifierRoute = {
  path: '/api/identify',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      const body = await c.req.json().catch(() => ({} as any));
      const paragraph = (body as any)?.paragraph as string | undefined;
      if (typeof paragraph !== 'string') {
        return c.json({ error: 'Body must include paragraph: string' }, 400);
      }

      const { paragraph: _omit, ...form } = (body ?? {}) as Record<string, unknown>;
      const { mapping } = await identifyService(mastra, ({ form, paragraph } as any));
      return c.json({ result: mapping });
    };
  },
} as const;

export default fieldIdentifierRoute;



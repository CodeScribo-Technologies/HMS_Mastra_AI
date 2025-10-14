import { fieldIdentifierService } from '../agents/field_identifier';
export const fieldIdentifierRoute = {
  path: '/field-identifier',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      const body = await c.req.json().catch(() => ({} as any));
      const paragraph = (body as any)?.paragraph as string | undefined;
      const form = (body as any)?.form as Record<string, unknown> | undefined;
      if (typeof paragraph !== 'string') {
        return c.json({ error: 'Body must include paragraph: string' }, 400);
      }
      if (!form || typeof form !== 'object') {
        return c.json({ error: 'Body must include form: object' }, 400);
      }

      const { mapping } = await fieldIdentifierService(mastra, ({ form, paragraph } as any));
      return c.json({ result: mapping });
    };
  },
} as const;

export default fieldIdentifierRoute;



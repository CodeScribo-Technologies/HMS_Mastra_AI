import { fieldIdentifierService, type FieldIdentifierRequest } from '../agents/field_identifier';

export const fieldIdentifierRoute = {
  path: '/field-identifier',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      try {
        const body = await c.req.json() as FieldIdentifierRequest;
        
        if (typeof body.paragraph !== 'string') {
          return c.json({ error: 'Body must include paragraph: string' }, 400);
        }
        
        if (!body.form || typeof body.form !== 'object') {
          return c.json({ error: 'Body must include form: object' }, 400);
        }

        const { mapping } = await fieldIdentifierService(mastra, body);
        return c.json({ result: mapping });
      } catch (error) {
        return c.json({ error: 'Invalid JSON body' }, 400);
      }
    };
  },
} as const;

export default fieldIdentifierRoute;



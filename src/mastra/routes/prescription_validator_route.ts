import { prescriptionValidatorService, type PrescriptionValidatorRequest } from '../agents/prescription_validator.js';

export const prescriptionValidatorRoute = {
  path: '/prescription-validator',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      try {
        const body = await c.req.json() as PrescriptionValidatorRequest;

        if (!body || typeof body !== 'object') {
          return c.json({ error: 'Body must be a valid object' }, 400);
        }

        const result = await prescriptionValidatorService(mastra, body);
        return c.json({ result });
      } catch (error) {
        return c.json({ error: 'Invalid JSON body' }, 400);
      }
    };
  },
} as const;

export default prescriptionValidatorRoute;



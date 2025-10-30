import { processAndCompareReports } from '../services/report_comparator_service.js';

export const reportComparatorRoute = {
  path: '/report-comparator',
  method: 'POST',
  createHandler: async ({ mastra }) => {
    return async (c) => {
      try {
        const formData = await c.req.formData();
        const sourceFile = formData.get('sourceFile') as File;
        const targetFile = formData.get('targetFile') as File;

        if (!sourceFile) {
          return c.json({ error: 'sourceFile is required' }, 400);
        }
        
        if (!targetFile) {
          return c.json({ error: 'targetFile is required' }, 400);
        }

        const result = await processAndCompareReports(mastra, sourceFile, targetFile);
        
        return c.json({ result });
      } catch (error) {
        console.error('Report comparison error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ error: `Failed to compare reports: ${errorMessage}` }, 400);
      }
    };
  },
} as const;

export default reportComparatorRoute;

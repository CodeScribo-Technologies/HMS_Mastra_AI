import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { runQuery } from '../utils/db';

const DEFAULT_LIMIT = Number(process.env.DB_QUERY_LIMIT || 20);

export const dbQueryTool = createTool({
  id: 'run_postgres_query',
  description: 'Run a safe SQL SELECT query on the hospital database to retrieve information.',
  inputSchema: z.object({
    query: z.string().describe('The SELECT SQL query to run. Must be read-only (no INSERT/UPDATE/DELETE).'),
  }),
  execute: async ({ context }) => {
    const raw = String((context as { query?: string }).query || '').trim();
    const withoutTrailingSemi = raw.replace(/;\s*$/, '');

    if (!withoutTrailingSemi.toLowerCase().startsWith('select')) {
      return { error: 'Only SELECT queries are allowed' };
    }

    if (withoutTrailingSemi.includes(';')) {
      return { error: 'Single statement only (no semicolons)' };
    }

    let withSoftDelete = withoutTrailingSemi;
    if (!/deleted_at\s+is\s+null/i.test(withSoftDelete)) {
      if (/\bwhere\b/i.test(withSoftDelete)) {
        const re = /(where[\s\S]*?)(\s+order\s+by|\s+limit|\s+offset|$)/i;
        const replaced = withSoftDelete.replace(re, (_m, wherePart, tail) => {
          return `${wherePart} AND deleted_at IS NULL${tail}`;
        });
        withSoftDelete = replaced;
      } else {
        const re = /(\s+order\s+by|\s+limit|\s+offset|$)/i;
        withSoftDelete = withSoftDelete.replace(re, (tail: string) => ` WHERE deleted_at IS NULL${tail}`);
      }
    }

    let safeQuery = withSoftDelete;
    if (!/limit\s+\d+/i.test(withoutTrailingSemi)) {
      safeQuery = `${withSoftDelete} LIMIT ${DEFAULT_LIMIT}`;
    }

    try {
      const rows = await runQuery(safeQuery);
      return { rows };
    } catch (err: any) {
      return { error: err.message || 'Query execution failed' };
    }
  },
});

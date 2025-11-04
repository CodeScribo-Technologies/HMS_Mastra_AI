import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { runQuery, extractTableNames, applySoftDeleteFilter, enforceLimit, sanitizeQuery, validateSelectOnly, validateSingleStatement } from '../utils/db';

const DEFAULT_LIMIT = process.env.DB_QUERY_LIMIT ? Number(process.env.DB_QUERY_LIMIT) : undefined;
const SOFT_DELETE_COLUMN = 'deleted_at';

const ALLOWED_TABLES = new Set([
  'patients',
  'patient_visits',
  'nurse_sheets',
  'visit_examinations',
  'visit_diagnoses',
  'visit_invest_treatments',
  'visit_management_plans',
  'visit_followups',
  'patient_histories'  
]);

/**
 * Validate that query only references allowed tables
 */
function validateTableAccess(sql: string): { valid: boolean; error?: string; tables?: string[] } {
  const tableNames = extractTableNames(sql);
  
  if (tableNames.length === 0) {
    return { valid: false, error: 'No table names found in query. Please include a FROM clause.' };
  }

  const invalidTables = tableNames.filter(table => !ALLOWED_TABLES.has(table));
  
  if (invalidTables.length > 0) {
    return {
      valid: false,
      error: `Access denied: Tables "${invalidTables.join('", "')}" are not allowed. Only these tables are accessible: ${Array.from(ALLOWED_TABLES).join(', ')}`,
      tables: invalidTables,
    };
  }

  return { valid: true, tables: tableNames };
}

export const visitQueryTool = createTool({
  id: 'run_visit_query',
  description: 'Run a safe SQL SELECT query on patient visit tables only. Allowed tables: patients, patient_visits, visit_examinations, visit_diagnoses, visit_invest_treatments, visit_management_plans, visit_followups, nurse_sheets. Only read-only SELECT queries are allowed.',
  inputSchema: z.object({
    query: z.string().describe('The SELECT SQL query to run. Must be read-only and only query patient visit related tables.'),
  }),
  execute: async ({ context }) => {
    const raw = String((context as { query?: string }).query || '').trim();
    const sanitizedQuery = sanitizeQuery(raw);

    const selectValidation = validateSelectOnly(sanitizedQuery);
    if (!selectValidation.valid) {
      return { error: selectValidation.error };
    }

    const statementValidation = validateSingleStatement(sanitizedQuery);
    if (!statementValidation.valid) {
      return { error: statementValidation.error };
    }

    const validation = validateTableAccess(sanitizedQuery);
    if (!validation.valid) {
      return { error: validation.error };
    }

    const withSoftDelete = applySoftDeleteFilter(sanitizedQuery, SOFT_DELETE_COLUMN);
    const safeQuery = enforceLimit(withSoftDelete, DEFAULT_LIMIT);

    try {
      const rows = await runQuery(safeQuery);
      return { rows, executedQuery: safeQuery };
    } catch (err: any) {
      return { error: err.message || 'Query execution failed' };
    }
  },
});


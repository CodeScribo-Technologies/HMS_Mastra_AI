import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.POSTGRESQL_CONNECTION_URI,
});

export async function runQuery(sql: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql);
    return result.rows;
  } finally {
    client.release();
  }
}


export function extractTableNames(sql: string): string[] {
  const tableNames = new Set<string>();

  const fromPattern = /\bfrom\s+([a-z_][a-z0-9_.]*)(?:\s|$|,|as\s+\w+|where|join|group|order|limit)/gi;
  let match;
  while ((match = fromPattern.exec(sql)) !== null) {
    const tableRef = match[1].toLowerCase();
    const tableName = tableRef.includes('.') 
      ? tableRef.split('.').pop() || tableRef
      : tableRef;
    const cleanName = tableName.replace(/["'`]/g, '');
    if (cleanName) tableNames.add(cleanName);
  }
  
  const joinPattern = /\b(?:left|right|inner|full|cross)?\s+join\s+([a-z_][a-z0-9_.]*)(?:\s|$|as\s+\w+|on\s+\w+|where|group|order|limit)/gi;
  while ((match = joinPattern.exec(sql)) !== null) {
    const tableRef = match[1].toLowerCase();
    const tableName = tableRef.includes('.') 
      ? tableRef.split('.').pop() || tableRef
      : tableRef;
    const cleanName = tableName.replace(/["'`]/g, '');
    if (cleanName) tableNames.add(cleanName);
  }
  
  const updatePattern = /\bupdate\s+([a-z_][a-z0-9_.]*)/gi;
  while ((match = updatePattern.exec(sql)) !== null) {
    const tableRef = match[1].toLowerCase();
    const tableName = tableRef.includes('.') 
      ? tableRef.split('.').pop() || tableRef
      : tableRef;
    const cleanName = tableName.replace(/["'`]/g, '');
    if (cleanName) tableNames.add(cleanName);
  }
  
  const insertPattern = /\binsert\s+into\s+([a-z_][a-z0-9_.]*)/gi;
  while ((match = insertPattern.exec(sql)) !== null) {
    const tableRef = match[1].toLowerCase();
    const tableName = tableRef.includes('.') 
      ? tableRef.split('.').pop() || tableRef
      : tableRef;
    const cleanName = tableName.replace(/["'`]/g, '');
    if (cleanName) tableNames.add(cleanName);
  }

  return Array.from(tableNames);
}

export function applySoftDeleteFilter(sql: string, softDeleteColumn: string = 'deleted_at'): string {
  const softDeletePattern = new RegExp(`${softDeleteColumn}\\s+is\\s+null`, 'i');
  if (softDeletePattern.test(sql)) {
    return sql;
  }

  if (/\bwhere\b/i.test(sql)) {
    const re = /(where[\s\S]*?)(\s+order\s+by|\s+limit|\s+offset|$)/i;
    return sql.replace(re, (_m, wherePart, tail) => `${wherePart} AND ${softDeleteColumn} IS NULL${tail}`);
  } else {
    const re = /(\s+order\s+by|\s+limit|\s+offset|$)/i;
    return sql.replace(re, (tail: string) => ` WHERE ${softDeleteColumn} IS NULL${tail}`);
  }
}

export function enforceLimit(sql: string, defaultLimit?: number): string {
  if (defaultLimit === undefined) {
    return sql;
  }

  const limitMatch = /\blimit\s+(\d+)/i.exec(sql);
  if (limitMatch) {
    const requested = Number(limitMatch[1]);
    if (!Number.isFinite(requested) || requested < 1) {
      return sql.replace(/\blimit\s+\d+/i, `LIMIT ${defaultLimit}`);
    } else if (requested > defaultLimit) {
      return sql.replace(/\blimit\s+\d+/i, `LIMIT ${defaultLimit}`);
    }
    return sql;
  } else {
    return `${sql} LIMIT ${defaultLimit}`;
  }
}

export function sanitizeQuery(sql: string): string {
  return sql.trim().replace(/;\s*$/, '');
}

export function validateSelectOnly(sql: string): { valid: boolean; error?: string } {
  if (!sql.toLowerCase().startsWith('select')) {
    return { valid: false, error: 'Only SELECT queries are allowed' };
  }
  return { valid: true };
}

export function validateSingleStatement(sql: string): { valid: boolean; error?: string } {
  if (sql.includes(';')) {
    return { valid: false, error: 'Single statement only (no semicolons)' };
  }
  return { valid: true };
}


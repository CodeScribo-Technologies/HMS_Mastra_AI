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



import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  fwSql: ReturnType<typeof postgres> | undefined;
};

const url = process.env.DATABASE_URL;

const sql =
  globalForDb.fwSql ??
  postgres(url || 'postgres://127.0.0.1:1/frequency_wave', {
    max: 1,
    connect_timeout: 8,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.fwSql = sql;

export const db = drizzle(sql, { schema });
export * from './schema';

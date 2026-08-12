import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  fwSql: ReturnType<typeof postgres> | undefined;
};

const sql =
  globalForDb.fwSql ?? postgres(process.env.DATABASE_URL!, { max: 10 });

if (process.env.NODE_ENV !== 'production') globalForDb.fwSql = sql;

export const db = drizzle(sql, { schema });
export * from './schema';

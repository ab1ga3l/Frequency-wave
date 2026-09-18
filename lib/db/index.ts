/** Postgres client: per-request on Workers, reused locally during next dev. */
import { cache } from 'react';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export * from './schema';

type AppDb = ReturnType<typeof makeDb>;

function makeDb(connectionString: string) {
  const sql = postgres(connectionString, {
    max: 1,
    connect_timeout: 8,
    fetch_types: false,
    prepare: false,
  });
  return drizzle(sql, { schema });
}

function connectionString() {
  try {
    const { env } = getCloudflareContext();
    const hyperdrive = (
      env as { HYPERDRIVE?: { connectionString?: string } }
    ).HYPERDRIVE;
    if (hyperdrive?.connectionString) return hyperdrive.connectionString;
  } catch {
    // next dev, OpenNext build, or no Hyperdrive binding
  }
  return process.env.DATABASE_URL || 'postgres://127.0.0.1:1/frequency_wave';
}

export const getDb = cache(() => makeDb(connectionString()));

export const db = new Proxy({} as AppDb, {
  get(_target, prop) {
    const client = getDb();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

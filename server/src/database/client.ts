import { PrismaClient } from '@prisma/client';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

const mode = process.env.MODE ?? 'local';
const password = process.env.SUPABASE_PASSWORD ?? '';
const supabseHost = process.env.SUPABASE_HOST ?? '';
const supabaseApiKey = process.env.SUPABASE_API_KEY ?? '';

let db: PrismaClient | undefined = undefined;
let supabase: SupabaseClient | undefined = undefined;

/**
 * Returns a singleton instance of a PrismaClient
 */
export const dbClient = () => {
  if (db) {
    return db;
  }
  const env = {
    host: supabseHost.replace('.supabase.co', ''),
    password,
    username: 'postgres',
    dbName: 'compassdb',
    port: '6543',
  };

  // Supabase connection pool URL
  const url =
    mode === 'local'
      ? `postgres://${env.username}:${env.password}@localhost:5432/postgres`
      : `postgres://${env.username}.${env.host}:${env.password}@aws-0-us-east-1.pooler.supabase.com:${env.port}/postgres?pgbouncer=true`;

  db = new PrismaClient({ datasources: { db: { url } } });

  return db;
};

export const supabaseClient = () => {
  if (supabase) {
    return supabase;
  }

  supabase = createClient(`https://${supabseHost}`, supabaseApiKey);
  return supabase;
};

import { PrismaClient } from '@prisma/client';
import { LocalSupabaseClient, createLocalSupabaseClient } from '../local-utils';

// Note: These env variables are not used if you're running the app in local mode.
// const supabaseApiKey = process.env.SUPABASE_API_KEY ?? '';
const mode = process.env.MODE ?? 'local';
const password = process.env.SUPABASE_PASSWORD ?? '';
const supabseHost = process.env.SUPABASE_HOST ?? '';

const dbName = process.env.DATABASE_NAME ?? 'postgres';

let db: PrismaClient | undefined = undefined;
let supabase: LocalSupabaseClient | undefined = undefined;

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
    dbName,
    username: 'postgres',
    port: '6543',
  };

  // Supabase connection pool URL
  const url =
    mode === 'local'
      ? `postgres://${env.username}:${env.password}@localhost:5432/${env.dbName}`
      : `postgres://${env.username}.${env.host}:${env.password}@aws-0-us-east-1.pooler.supabase.com:${env.port}/${env.dbName}?pgbouncer=true`;

  db = new PrismaClient({ datasources: { db: { url } } });

  return db;
};

export const supabaseClient = (): LocalSupabaseClient => {
  if (supabase) {
    return supabase;
  }

  // supabase = createClient(`https://${supabseHost}`, supabaseApiKey);

  supabase = createLocalSupabaseClient();

  return supabase;
};

import { neon } from '@neondatabase/serverless';

// Add DATABASE_URL from your Neon project to .env.local.
// This helper keeps database access server-side only.
export function getSql() {
  if (!process.env.DATABASE_URL) return null;
  return neon(process.env.DATABASE_URL);
}

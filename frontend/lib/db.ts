// Neon Postgres client for Next.js (remove Prisma, align with principle IX)

// Use server-only; don't leak DB creds to client bundles
import { Pool } from 'pg';

/**
 * Creates and exports a Neon Postgres connection pool.
 * This is a singleton—connection pooling is managed by Neon serverlessly.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;

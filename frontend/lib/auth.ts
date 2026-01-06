import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt } from "better-auth/plugins";

/**
 * Better Auth configuration for Neon Postgres using `pg` (no Prisma).
 *
 * IMPORTANT:
 * - This file is server-only. Do NOT import it from Client Components.
 * - Better Auth does NOT automatically create tables in Neon — you must run its
 *   CLI migrations against the same DATABASE_URL used here.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Neon requires SSL in most setups; this keeps it simple for local/dev.
    rejectUnauthorized: false,
  },
});

export const auth = betterAuth({
  // Shared secret between Better Auth and FastAPI (for JWT validation)
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,

  // Direct Postgres connection via `pg` (Neon-compatible)
  database: pool,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  // Enable JWT plugin so we can validate tokens in FastAPI
  plugins: [jwt()],
});



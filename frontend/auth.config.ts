"""Better Auth configuration for frontend authentication."""
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

// Import Prisma client (should be created separately)
// import { prisma } from "@/lib/db"

/**
 * Better Auth instance configuration.
 *
 * Better Auth handles:
 * - User registration and login
 * - Password hashing and storage
 * - Session management
 * - JWT token generation
 * - Cookie setting (httpOnly)
 *
 * Shared secrets with FastAPI:
 * - JWT_SECRET_KEY must match backend's JWT_SECRET_KEY
 * - Both connect to same PostgreSQL database
 */
export const auth = betterAuth({
  // Secret for signing sessions (SHARED with FastAPI)
  secret: process.env.BETTER_AUTH_SECRET || "dev-secret-change-in-production",

  // Base URL for authentication callbacks
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Database adapter using Prisma
  // database: prismaAdapter(prisma, {
  //   provider: "postgresql",
  // }),

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  // Advanced configuration
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5, // 5 seconds
    },
  },
})

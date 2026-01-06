import { SignJWT } from "jose"

/**
 * Issue a short-lived JWT for FastAPI using the same secret as the backend.
 * This bridges Better Auth's session to FastAPI's JWT-based auth.
 */
export async function issueBackendJwt(userId: string): Promise<string> {
  if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is not set")
  }

  const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET)

  return await new SignJWT({})
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("1h")
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(secret)
}



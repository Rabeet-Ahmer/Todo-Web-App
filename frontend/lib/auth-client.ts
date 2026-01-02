/**
 * Better Auth client utilities for frontend authentication.
 *
 * This module handles:
 * - JWT token extraction from Better Auth session cookies
 * - Better Auth client instance
 */

/**
 * Fetch JWT token from Better Auth session cookies.
 *
 * Better Auth stores sessions in cookies. We extract the token
 * to send it to FastAPI in the Authorization header.
 *
 * @returns JWT token string or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  // Server-side token extraction
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    // Better Auth stores session token in cookie named based on configuration
    // Common cookie names: "better-auth.session_token" or "session_token"
    const sessionToken = cookieStore.get('better-auth.session_token')

    return sessionToken?.value || null
  }

  // Client-side token extraction
  const cookies = document.cookie.split(';').map(c => c.trim())
  const sessionCookie = cookies.find(c => c.startsWith('better-auth.session_token='))

  if (!sessionCookie) {
    return null
  }

  return sessionCookie.split('=')[1]
}

/**
 * Better Auth API client type.
 * This would be imported from better-auth client library
 */
export interface BetterAuthClient {
  signIn: {
    email: (data: { email: string; password: string }) => Promise<void>
  }
  signUp: {
    email: (data: { email: string; password: string; name?: string }) => Promise<void>
  }
  signOut: (options?: { fetchOptions?: { onSuccess?: () => void } }) => Promise<void>
  useSession: () => {
    data: { user: { id: number; email: string; name?: string } | null }
    isPending: boolean
  }
}

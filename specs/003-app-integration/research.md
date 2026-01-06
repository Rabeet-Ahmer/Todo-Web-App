# Research: App Integration with better-auth and FastAPI

## Decision: JWT Bearer Authentication with Remote JWKS Validation

### Rationale
`better-auth` provides a `jwt` plugin that allows the Next.js frontend to generate JWTs signed with a private key. The public keys are exposed via a JWKS (JSON Web Key Set) endpoint (`/api/auth/jwks`).
For a FastAPI backend to verify these tokens in a production-ready and performant way:
1. The backend will fetch and cache the JWKS from the Next.js auth endpoint.
2. FastAPI will use the `python-jose` or `PyJWT` library to verify incoming `Authorization: Bearer <token>` headers against these public keys.
3. This approach is stateless, doesn't require a database call per request on the backend, and handles token rotation via the JWKS endpoint.

### Alternatives Considered
- **Session API Proxy**: Backend calls `better-auth.api.getSession` for every request. **Rejected** because it introduces significant latency (network call per API request) and requires the backend to have direct access to the auth server's internal API or shared DB.
- **Shared Database**: Backend reads `session` table directly. **Rejected** because it couples the backend and auth database schemas and increases DB load.
- **Custom JWT Shared Secret**: Using a shared `JWT_SECRET`. **Rejected** because `better-auth`'s built-in JWKS support is more robust (supports rotation, doesn't require sharing secrets across environments manually as long as the JWKS endpoint is reachable).

## Technical Implementation Details

### Frontend (Next.js)
- Configure `better-auth` with `jwt` plugin.
- Use `authClient.jwt.generate()` or similar to retrieve a token if needed, or rely on automatic session/JWT handling if using the bearer plugin.
- Central API client will include the token in the `Authorization` header.

### Backend (FastAPI)
- **Dependency**: `get_current_user` will:
    - Extract bearer token.
    - Validate signature using public keys from `NEXT_PUBLIC_AUTH_URL/api/auth/jwks`.
    - Cache the public keys for performance.
    - Extract `sub` (userId) from the payload.
    - Return the User object from the backend DB.

## Decision: Unified API Client with SWR/Fetch

### Rationale
Using a centralized `api-client.ts` in the frontend ensures consistent error handling, automatic token injection, and base URL management. `SWR` provides excellent caching and revalidation out of the box.

### Alternatives Considered
- **Axios**: Provides more built-in features like interceptors. **Rejected** in favor of native `fetch` to keep bundle size small (Principle VIII).
- **TanStack Query (React Query)**: More full-featured but potentially overkill for a simple Todo app. **SWR** is simpler and highly effective for Next.js.

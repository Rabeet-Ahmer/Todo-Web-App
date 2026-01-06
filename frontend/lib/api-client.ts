/**
 * API Client for FastAPI Backend
 * Handles token injection from Better Auth session
 */

// Import toast for notifications
import { toast } from 'sonner';

async function getAuthToken(): Promise<string | null> {
    if (typeof window === "undefined") {
        // Server side: Extract from cookies
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("better-auth.session_token");
        return sessionToken?.value || null;
    } else {
        // Client side: Better Auth sets a cookie that the browser sends automatically,
        // but for Bearer token auth in FastAPI, we might need to extract it.
        // Better Auth stores the token in localStorage or cookies depending on config.
        // Assuming we use the cookies for consistency.
        const name = "better-auth.session_token=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = await getAuthToken();

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "API request failed" }));
            const errorMessage = errorData.detail || "API request failed";

            // Show toast notification for API failures
            toast.error(`API Error: ${errorMessage}`, {
                description: `Failed to access ${endpoint}`,
                duration: 5000,
            });

            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error) {
        // Handle network errors or other exceptions
        const errorMessage = error instanceof Error ? error.message : "Network error occurred";

        // Show toast notification for network errors
        toast.error(`Network Error: ${errorMessage}`, {
            description: `Failed to connect to ${endpoint}`,
            duration: 5000,
        });

        throw error;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, data: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(data) }),
    patch: <T>(endpoint: string, data: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(data) }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

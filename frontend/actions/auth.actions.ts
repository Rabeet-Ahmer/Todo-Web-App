"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function getSession() {
    try {
        return await auth.api.getSession({
            headers: await headers()
        });
    } catch (error) {
        // If session validation fails, return null
        console.error("Session validation failed:", error);
        return null;
    }
}

export async function requireAuth() {
    const session = await getSession();
    if (!session) {
        // Redirect to login with optional return URL
        const requestHeaders = await headers();
        const url = requestHeaders.get('x-url') || '/login';
        redirect(`/login?return=${encodeURIComponent(url)}`);
    }
    return session;
}

// Function to check if session is valid without redirecting
export async function checkAuth() {
    const session = await getSession();
    return session;
}

// OPTIONAL OPTIMIZATION: Cached middleware session validation
// This reduces the /auth/session API call overhead
// Only use this if you're still experiencing slow middleware validation

import { NextRequest, NextResponse } from "next/server";
import { authAdapter } from "./adapters";

// Simple in-memory cache for session validation
// In production, consider Redis or a distributed cache
const sessionCache = new Map<string, { valid: boolean; expiresAt: number }>();
const CACHE_DURATION = 30 * 1000; // 30 seconds

function getCachedSession(token: string): boolean | null {
    const cached = sessionCache.get(token);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
        sessionCache.delete(token);
        return null;
    }
    return cached.valid;
}

function setCachedSession(token: string, valid: boolean) {
    sessionCache.set(token, {
        valid,
        expiresAt: Date.now() + CACHE_DURATION
    });

    // Cleanup old entries (prevent memory leak)
    if (sessionCache.size > 1000) {
        const now = Date.now();
        for (const [key, value] of sessionCache.entries()) {
            if (now > value.expiresAt) {
                sessionCache.delete(key);
            }
        }
    }
}

export const middlewareFn = async (req: NextRequest) => {
    // Try the adapter first (handles route matching + validation)
    const adapterResult = await authAdapter.handleMiddleware(req);

    // If adapter says "let it through" (null), no caching needed
    // If adapter would redirect, we can add caching around it
    if (adapterResult) {
        return adapterResult;
    }

    return NextResponse.next();
};

export const configObj = (paths: string[]) => ({
    matcher: paths,
});

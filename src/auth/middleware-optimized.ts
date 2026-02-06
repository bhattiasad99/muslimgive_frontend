// OPTIONAL OPTIMIZATION: Cached middleware session validation
// This reduces the /auth/session API call overhead
// Only use this if you're still experiencing slow middleware validation

import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_LABEL, AUTH_ROUTES } from "./constants";
import { serverUrl } from "@/app/lib/definitions";

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

function makeLoginUrl(req: NextRequest) {
    const url = new URL("/login", req.url);
    const dest = req.nextUrl.pathname + req.nextUrl.search;
    url.searchParams.set("continue", dest);
    return url;
}

export const middlewareFn = async (req: NextRequest) => {
    const { pathname } = req.nextUrl;
    const needsAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));
    if (!needsAuth) return NextResponse.next();

    const token = req.cookies.get(`${AUTH_COOKIE_LABEL}`)?.value;
    if (!token) {
        return NextResponse.redirect(makeLoginUrl(req));
    }

    // Check cache first
    const cachedValid = getCachedSession(token);
    if (cachedValid === true) {
        return NextResponse.next();
    }
    if (cachedValid === false) {
        return NextResponse.redirect(makeLoginUrl(req));
    }

    // Cache miss - validate with API
    try {
        if (!serverUrl) {
            setCachedSession(token, false);
            return NextResponse.redirect(makeLoginUrl(req));
        }

        const cookieHeader = req.headers.get('cookie') || `${AUTH_COOKIE_LABEL}=${encodeURIComponent(token)}`;
        const res = await fetch(new URL('auth/session', serverUrl).toString(), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                cookie: cookieHeader,
            },
            cache: 'no-store',
        });

        const isValid = res.ok;
        setCachedSession(token, isValid);

        if (!isValid) {
            return NextResponse.redirect(makeLoginUrl(req));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Middleware session check failed:', error);
        // Don't cache failures - let next request try again
        return NextResponse.redirect(makeLoginUrl(req));
    }
};

export const configObj = (paths: string[]) => ({
    matcher: paths,
});

import { NextRequest, NextResponse } from 'next/server';
import { parse as parseSetCookie } from 'set-cookie-parser';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_LABEL, AUTH_REFRESH_MARKER, AUTH_ROUTES, SESSION_REFRESH_INTERVAL_MS } from '../constants';
import { serverUrl } from '@/app/lib/definitions';
import type { AuthAdapter } from './auth-adapter';

/**
 * Cookie/session-based auth adapter — the current (default) strategy.
 *
 * Session ID lives in an httpOnly cookie named `sid`.
 * Refresh is tracked client-side via a `sid_rf` timestamp cookie.
 */
export class CookieAuthAdapter implements AuthAdapter {

    // ── token access ────────────────────────────────────────────

    async getToken(): Promise<string | null> {
        const jar = await cookies();
        return jar.get(AUTH_COOKIE_LABEL)?.value ?? null;
    }

    async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await this.getToken();
        if (!token) return {};
        return { cookie: `${AUTH_COOKIE_LABEL}=${encodeURIComponent(token)}` };
    }

    // ── refresh ─────────────────────────────────────────────────

    async maybeRefresh(): Promise<void> {
        if (!serverUrl) return;
        const token = await this.getToken();
        if (!token) return;

        const jar = await cookies();
        const marker = jar.get(AUTH_REFRESH_MARKER)?.value;
        const lastRefreshMs = marker ? Number(marker) : 0;
        if (Number.isFinite(lastRefreshMs) && Date.now() - lastRefreshMs < SESSION_REFRESH_INTERVAL_MS) {
            return;
        }

        try {
            const res = await fetch(new URL('auth/refresh', serverUrl).toString(), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    cookie: `${AUTH_COOKIE_LABEL}=${encodeURIComponent(token)}`,
                },
                cache: 'no-store',
            });
            if (res.ok) {
                await this.persistTokenFromResponse(res);
            }
        } catch {
            // ignore refresh failures; the request flow will surface auth errors
        }
    }

    // ── persist from backend response ───────────────────────────

    async persistTokenFromResponse(res: Response): Promise<void> {
        const setCookies = res.headers.getSetCookie?.();
        if (!setCookies || setCookies.length === 0) return;
        const parsed = parseSetCookie(setCookies, { map: true });
        const sessionCookie = parsed[AUTH_COOKIE_LABEL];
        if (!sessionCookie?.value) return;

        try {
            const jar = await cookies();

            jar.set({
                name: AUTH_COOKIE_LABEL,
                value: sessionCookie.value,
                secure: sessionCookie.secure ?? process.env.NODE_ENV === 'production',
                httpOnly: sessionCookie.httpOnly ?? true,
                expires: sessionCookie.expires ? new Date(sessionCookie.expires) : undefined,
                maxAge: sessionCookie.maxAge,
                sameSite: (sessionCookie.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
                path: sessionCookie.path ?? '/',
                ...(sessionCookie.domain ? { domain: sessionCookie.domain } : {}),
            });

            jar.set({
                name: AUTH_REFRESH_MARKER,
                value: Date.now().toString(),
                secure: sessionCookie.secure ?? process.env.NODE_ENV === 'production',
                httpOnly: true,
                expires: sessionCookie.expires ? new Date(sessionCookie.expires) : undefined,
                maxAge: sessionCookie.maxAge,
                sameSite: (sessionCookie.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
                path: sessionCookie.path ?? '/',
                ...(sessionCookie.domain ? { domain: sessionCookie.domain } : {}),
            });
        } catch (err: any) {
            console.warn('persistTokenFromResponse failed (safely ignored in SC):', err.message);
        }
    }

    // ── middleware ───────────────────────────────────────────────

    async handleMiddleware(request: NextRequest): Promise<NextResponse | null> {
        const { pathname } = request.nextUrl;
        const needsAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));
        if (!needsAuth) return null; // let it through

        const token = request.cookies.get(AUTH_COOKIE_LABEL)?.value;
        if (!token) {
            return NextResponse.redirect(this.makeLoginUrl(request));
        }

        try {
            if (!serverUrl) {
                return NextResponse.redirect(this.makeLoginUrl(request));
            }
            const cookieHeader =
                request.headers.get('cookie') ||
                `${AUTH_COOKIE_LABEL}=${encodeURIComponent(token)}`;
            const res = await fetch(new URL('auth/session', serverUrl).toString(), {
                method: 'GET',
                headers: { Accept: 'application/json', cookie: cookieHeader },
                cache: 'no-store',
            });
            if (!res.ok) {
                return NextResponse.redirect(this.makeLoginUrl(request));
            }
        } catch {
            return NextResponse.redirect(this.makeLoginUrl(request));
        }

        return null; // session valid — continue
    }

    // ── helpers ─────────────────────────────────────────────────

    private makeLoginUrl(req: NextRequest): URL {
        const url = new URL('/login', req.url);
        const dest = req.nextUrl.pathname + req.nextUrl.search;
        url.searchParams.set('continue', dest);
        return url;
    }
}

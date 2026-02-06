import { parse as parseSetCookie } from 'set-cookie-parser';
import { getCookies, setSessionCookie } from "./cookies";
import { AUTH_COOKIE_LABEL, SESSION_REFRESH_INTERVAL_MS } from "./constants";
import { ResponseType, serverUrl } from "@/app/lib/definitions";

export type RawResponse<T = any> = {
    res: Response;
    data: T | null;
};

const fetchFailed = (requireAuth: boolean, message = 'Backend unreachable'): ResponseType => {
    return {
        ok: false,
        payload: null,
        unauthenticated: requireAuth,
        message,
    };
};

const setCookiesFromResponse = async (res: Response) => {
    const setCookies = res.headers.getSetCookie?.()
    if (!setCookies || setCookies.length === 0) return;
    const parsed = parseSetCookie(setCookies, { map: true })
    const sessionCookie = parsed[AUTH_COOKIE_LABEL]
    if (!sessionCookie?.value) return;
    await setSessionCookie(AUTH_COOKIE_LABEL, sessionCookie.value, {
        httpOnly: sessionCookie.httpOnly,
        secure: sessionCookie.secure,
        sameSite: sessionCookie.sameSite as 'lax' | 'strict' | 'none' | undefined,
        path: sessionCookie.path,
        domain: sessionCookie.domain,
        expires: sessionCookie.expires ? new Date(sessionCookie.expires) : undefined,
        maxAge: sessionCookie.maxAge,
    })
}

const maybeRefreshSession = async () => {
    if (!serverUrl) return;
    const { accessToken, refreshMarker } = await getCookies();
    if (!accessToken) return;

    const lastRefreshMs = refreshMarker ? Number(refreshMarker) : 0;
    if (Number.isFinite(lastRefreshMs) && Date.now() - lastRefreshMs < SESSION_REFRESH_INTERVAL_MS) {
        return;
    }

    try {
        const res = await fetch(new URL('auth/refresh', serverUrl).toString(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                cookie: `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`,
            },
            cache: 'no-store',
        })
        if (res.ok) {
            await setCookiesFromResponse(res);
        }
    } catch {
        // ignore refresh failures; request flow will handle auth errors
    }
}

export const _getRaw = async (request: string, requireAuth = true): Promise<RawResponse> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth && accessToken) headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers,
            cache: 'no-store',
        })

        let data: any = null;
        try { data = await res.json(); } catch { /* noop */ }

        return { res, data };
    } catch {
        return { res: new Response(null, { status: 503 }), data: null };
    }
}

export const _postRaw = async (request: string, body: any, requireAuth = true): Promise<RawResponse> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };

    if (requireAuth && accessToken) headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers,
            cache: 'no-store',
            body: JSON.stringify(body)
        })

        let data: any = null;
        try { data = await res.json(); } catch { /* noop */ }

        return { res, data };
    } catch {
        return { res: new Response(null, { status: 503 }), data: null };
    }
}

export const _patchRaw = async <K = any>(request: string, body: K, requireAuth = true): Promise<RawResponse> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };

    if (requireAuth && accessToken) headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;

    try {
        const res = await fetch(url, {
            method: 'PATCH',
            headers,
            cache: 'no-store',
            body: JSON.stringify(body)
        })

        let data: any = null;
        try { data = await res.json(); } catch { /* noop */ }

        return { res, data };
    } catch {
        return { res: new Response(null, { status: 503 }), data: null };
    }
}

export const _deleteRaw = async (request: string, requireAuth = true): Promise<RawResponse> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth && accessToken) headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;

    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers,
            cache: 'no-store',
        })

        let data: any = null;
        try { data = await res.json(); } catch { /* noop */ }

        return { res, data };
    } catch {
        return { res: new Response(null, { status: 503 }), data: null };
    }
}

export const _get = async (request: string, requireAuth = true): Promise<ResponseType> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    // Build URL safely
    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;
    }

    let res: Response;
    try {
        res = await fetch(url, {
            method: 'GET',
            headers,
            cache: 'no-store',
        })
    } catch {
        return fetchFailed(requireAuth);
    }

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message: data?.message || data?.error?.message || (unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin'),
        };
    }

    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: data?.message || 'Success!'
    };
}

export const _getWithAccessToken = async (request: string, accessToken?: string | null, requireAuth = true): Promise<ResponseType> => {
    // Build URL safely
    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;
    }

    let res: Response;
    try {
        res = await fetch(url, {
            method: 'GET',
            headers,
            cache: 'no-store',
        })
    } catch {
        return fetchFailed(requireAuth);
    }

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message: data?.message || data?.error?.message || (unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin'),
        };
    }

    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: data?.message || 'Success!'
    };
}

export const _post = async (request: string, body: any, requireAuth = true): Promise<ResponseType> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };

    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;
    }

    let res: Response;
    try {
        res = await fetch(url, {
            method: 'POST',
            headers,
            cache: 'no-store',
            body: JSON.stringify(body)
        })
    } catch {
        return fetchFailed(requireAuth);
    }

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message: data?.message || data?.error?.message || (unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin'),
        };
    }

    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: data?.message || 'Success!'
    };
}

export const _patch = async <K = any>(request: string, body: K, requireAuth = true): Promise<ResponseType> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' };

    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;
    }

    let res: Response;
    try {
        res = await fetch(url, {
            method: 'PATCH',
            headers,
            cache: 'no-store',
            body: JSON.stringify(body)
        })
    } catch {
        return fetchFailed(requireAuth);
    }

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message: data?.message || data?.error?.message || (unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin'),
        };
    }

    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: data?.message || 'Success!'
    };
}

export const _delete = async (request: string, requireAuth = true): Promise<ResponseType> => {
    if (requireAuth) await maybeRefreshSession();
    const { accessToken } = await getCookies();

    let url: string
    try {
        url = serverUrl ? new URL(request, serverUrl).toString() : request
    } catch {
        url = request
    }

    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        headers.cookie = `${AUTH_COOKIE_LABEL}=${encodeURIComponent(accessToken)}`;
    }

    let res: Response;
    try {
        res = await fetch(url, {
            method: 'DELETE',
            headers,
            cache: 'no-store',
        })
    } catch {
        return fetchFailed(requireAuth);
    }

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message: data?.message || data?.error?.message || (unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin'),
        };
    }

    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: data?.message || 'Success!'
    };
}

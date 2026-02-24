import { ResponseType, serverUrl } from "@/app/lib/definitions";
import { authAdapter } from "./adapters";

// ── types ───────────────────────────────────────────────────────

export type RawResponse<T = any> = {
    res: Response;
    data: T | null;
};

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// ── helpers ─────────────────────────────────────────────────────

const buildUrl = (path: string): string => {
    try {
        return serverUrl ? new URL(path, serverUrl).toString() : path;
    } catch {
        return path;
    }
};

const fetchFailed = (requireAuth: boolean, message = 'Backend unreachable'): ResponseType => ({
    ok: false,
    payload: null,
    unauthenticated: requireAuth,
    message,
});

const normalizeResponse = (res: Response, data: any): ResponseType => {
    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message:
                data?.message ||
                data?.error?.message ||
                (unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin'),
        };
    }
    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: data?.message || 'Success!',
    };
};

// ── core request functions ──────────────────────────────────────

/**
 * Low-level request returning the raw `Response` + parsed body.
 * Used when callers need access to headers, status, etc.
 */
const _requestRaw = async <T = any>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    requireAuth = true,
): Promise<RawResponse<T>> => {
    if (requireAuth) await authAdapter.maybeRefresh();

    const url = buildUrl(path);
    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth) {
        Object.assign(headers, await authAdapter.getAuthHeaders());
    }

    const isFormData = body instanceof FormData;
    if (body !== undefined && !isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    try {
        const res = await fetch(url, {
            method,
            headers: isFormData ? { ...headers } : headers,
            cache: 'no-store',
            body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });

        let data: T | null = null;
        try { data = await res.json() as T; } catch { /* noop */ }

        return { res, data };
    } catch {
        return { res: new Response(null, { status: 503 }), data: null };
    }
};

/**
 * High-level request returning the normalised `ResponseType` envelope.
 * This is what server actions should use 99% of the time.
 */
const _request = async <T = any>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    requireAuth = true,
): Promise<ResponseType<T>> => {
    if (requireAuth) await authAdapter.maybeRefresh();

    const url = buildUrl(path);
    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth) {
        const authHeaders = await authAdapter.getAuthHeaders();
        if (requireAuth && !Object.keys(authHeaders).length) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        Object.assign(headers, authHeaders);
    }

    const isFormData = body instanceof FormData;
    if (body !== undefined && !isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    let res: Response;
    try {
        res = await fetch(url, {
            method,
            headers,
            cache: 'no-store',
            body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });
    } catch {
        return fetchFailed(requireAuth);
    }

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    return normalizeResponse(res, data);
};

// ── public API (thin delegates) ─────────────────────────────────

// -- normalised (ResponseType) variants ---
export const _get = <T = any>(path: string, requireAuth = true) =>
    _request<T>('GET', path, undefined, requireAuth);

export const _post = <T = any>(path: string, body: any, requireAuth = true) =>
    _request<T>('POST', path, body, requireAuth);

export const _patch = <T = any>(path: string, body: any, requireAuth = true) =>
    _request<T>('PATCH', path, body, requireAuth);

export const _delete = <T = any>(path: string, requireAuth = true) =>
    _request<T>('DELETE', path, undefined, requireAuth);

// -- raw variants (need Response headers / status) ---
export const _getRaw = <T = any>(path: string, requireAuth = true) =>
    _requestRaw<T>('GET', path, undefined, requireAuth);

export const _postRaw = <T = any>(path: string, body: any, requireAuth = true) =>
    _requestRaw<T>('POST', path, body, requireAuth);

export const _patchRaw = <T = any>(path: string, body: any, requireAuth = true) =>
    _requestRaw<T>('PATCH', path, body, requireAuth);

export const _deleteRaw = <T = any>(path: string, requireAuth = true) =>
    _requestRaw<T>('DELETE', path, undefined, requireAuth);

/**
 * GET with an explicit token (used with `unstable_cache` where
 * cookie reading is forbidden inside the cache callback).
 */
export const _getWithAccessToken = async <T = any>(
    path: string,
    accessToken?: string | null,
    requireAuth = true,
): Promise<ResponseType<T>> => {
    const url = buildUrl(path);
    const headers: Record<string, string> = { Accept: 'application/json' };

    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        // Build auth header from explicit token (same format the adapter uses)
        headers.cookie = `sid=${encodeURIComponent(accessToken)}`;
    }

    let res: Response;
    try {
        res = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
    } catch {
        return fetchFailed(requireAuth);
    }

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    return normalizeResponse(res, data);
};

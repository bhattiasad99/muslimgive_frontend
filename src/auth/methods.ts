import { getCookies } from "./cookies";
import { AUTH_COOKIE_LABEL } from "./constants";
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

export const _getRaw = async (request: string, requireAuth = true): Promise<RawResponse> => {
    let { accessToken } = await getCookies();

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
    let { accessToken } = await getCookies();

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
    let { accessToken } = await getCookies();

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
    let { accessToken } = await getCookies();

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
    let { accessToken } = await getCookies();

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
    let { accessToken } = await getCookies();

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
    let { accessToken } = await getCookies();

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
    let { accessToken } = await getCookies();

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

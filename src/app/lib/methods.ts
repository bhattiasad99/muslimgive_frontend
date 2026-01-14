import { getCookies } from "./cookies";
import { ResponseType, serverUrl } from "./definitions";
import { refreshToken } from "../actions/refresh-token";

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

    // Auth logic with "missing token" handling for potential refresh
    if (requireAuth) {
        if (!accessToken) {
            const refreshRes = await refreshToken();
            if (refreshRes.ok) {
                const newCookies = await getCookies(); // Get the new access token
                accessToken = newCookies.accessToken;
            } else {
                return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
            }
        }
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store',
    })

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    // Interceptor for expired token
    if (!res.ok && res.status === 401 && (data?.message === 'jwt expired' || data?.error === 'Unauthorized')) {
        const refreshRes = await refreshToken();
        if (refreshRes.ok) {
            // Update token and retry
            const { accessToken: newAccessToken } = await getCookies();
            headers.Authorization = `Bearer ${newAccessToken}`;

            res = await fetch(url, {
                method: 'GET',
                headers,
                cache: 'no-store',
            });
            try { data = await res.json(); } catch { /* noop */ }
        }
    }

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
            const refreshRes = await refreshToken();
            if (refreshRes.ok) {
                const newCookies = await getCookies();
                accessToken = newCookies.accessToken;
            } else {
                return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
            }
        }
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(url, {
        method: 'POST',
        headers,
        cache: 'no-store',
        body: JSON.stringify(body)
    })

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok && res.status === 401 && (data?.message === 'jwt expired' || data?.error === 'Unauthorized')) {
        const refreshRes = await refreshToken();
        if (refreshRes.ok) {
            const { accessToken: newAccessToken } = await getCookies();
            headers.Authorization = `Bearer ${newAccessToken}`;

            res = await fetch(url, {
                method: 'POST',
                headers,
                cache: 'no-store',
                body: JSON.stringify(body)
            });
            try { data = await res.json(); } catch { /* noop */ }
        }
    }

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
            const refreshRes = await refreshToken();
            if (refreshRes.ok) {
                const newCookies = await getCookies();
                accessToken = newCookies.accessToken;
            } else {
                return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
            }
        }
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(url, {
        method: 'PATCH',
        headers,
        cache: 'no-store',
        body: JSON.stringify(body)
    })

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok && res.status === 401 && (data?.message === 'jwt expired' || data?.error === 'Unauthorized')) {
        const refreshRes = await refreshToken();
        if (refreshRes.ok) {
            const { accessToken: newAccessToken } = await getCookies();
            headers.Authorization = `Bearer ${newAccessToken}`;

            res = await fetch(url, {
                method: 'PATCH',
                headers,
                cache: 'no-store',
                body: JSON.stringify(body)
            });
            try { data = await res.json(); } catch { /* noop */ }
        }
    }

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
            const refreshRes = await refreshToken();
            if (refreshRes.ok) {
                const newCookies = await getCookies();
                accessToken = newCookies.accessToken;
            } else {
                return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
            }
        }
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    }

    let res = await fetch(url, {
        method: 'DELETE',
        headers,
        cache: 'no-store',
    })

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok && res.status === 401 && (data?.message === 'jwt expired' || data?.error === 'Unauthorized')) {
        const refreshRes = await refreshToken();
        if (refreshRes.ok) {
            const { accessToken: newAccessToken } = await getCookies();
            headers.Authorization = `Bearer ${newAccessToken}`;

            res = await fetch(url, {
                method: 'DELETE',
                headers,
                cache: 'no-store',
            });
            try { data = await res.json(); } catch { /* noop */ }
        }
    }

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

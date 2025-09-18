import { getCookies } from "./cookies";
import { ResponseType, serverUrl } from "./definitions";

export const _get = async (request: string, requireAuth = true): Promise<ResponseType> => {
    const { accessToken } = await getCookies();
    const url = new URL(request, serverUrl).toString()

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-store',
    })

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message: unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin',
        };
    }

    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: 'Success!'
    };
}
export const _post = async (request: string, body: any, requireAuth = true): Promise<ResponseType> => {
    const { accessToken } = await getCookies();
    const url = new URL(request, serverUrl).toString()

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (requireAuth) {
        if (!accessToken) {
            return { ok: false, payload: null, unauthenticated: true, message: 'Unauthorized' };
        }
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {
        method: 'POST',
        headers,
        cache: 'no-store',
        body: JSON.stringify(body)
    })

    let data: any = null;
    try { data = await res.json(); } catch { /* noop */ }

    if (!res.ok || data?.error) {
        const unauth = res.status === 401;
        return {
            ok: false,
            payload: null,
            unauthenticated: unauth,
            message: unauth ? 'Unauthorized' : 'Internal Server Error, Please contact Admin',
        };
    }

    return {
        ok: true,
        payload: data,
        unauthenticated: false,
        message: 'Success!'
    };
}
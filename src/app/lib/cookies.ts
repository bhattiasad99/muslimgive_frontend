'use server'

import { cookies } from "next/headers"
import { AUTH_COOKIE_LABEL } from "./definitions";

export const setSessionCookie = async (label: string, value: string, opts?: {
    expires?: Date;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    path?: string;
    domain?: string;
}) => {
    try {
        const jar = await cookies();

        jar.set({
            name: label,
            value: value,
            secure: opts?.secure ?? process.env.NODE_ENV === 'production',
            httpOnly: opts?.httpOnly ?? true,
            expires: opts?.expires,
            maxAge: opts?.maxAge,
            sameSite: opts?.sameSite ?? 'lax',
            path: opts?.path ?? '/',
            ...(opts?.domain ? { domain: opts.domain } : {}),
        })
    } catch (err: any) {
        // Swallow error in Server Components
        console.warn("setSessionCookie failed (safely ignored in SC):", err.message);
    }
}

export const getCookies = async () => {
    const _cookies = await cookies()
    const accessToken = _cookies.get(AUTH_COOKIE_LABEL)?.value
    return {
        accessToken
    }
}

export const clearAuthCookies = async () => {
    try {
        const jar = await cookies()
        const opts = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            expires: new Date(0),
            path: '/',
        }
        jar.set({ name: AUTH_COOKIE_LABEL, value: '', ...opts })
    } catch (error: any) {
        // Swallow error in Server Components
        console.warn("clearAuthCookies failed (safely ignored in SC):", error.message);
    }
}

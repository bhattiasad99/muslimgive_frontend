'use server'

import { jwtDecode } from "jwt-decode"
import { cookies } from "next/headers"
import { AUTH_COOKIE_LABEL, REFRESH_COOKIE_LABEL } from "./definitions";

export const setJwtCookie = async (label: string, value: string) => {
    try {
        const jar = await cookies();

        jar.set({
            name: label,
            value: value,
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            expires: new Date(jwtDecode(value).exp! * 1000),
            sameSite: 'lax'
        })
    } catch (err: any) {
        throw new Error(err?.message as string)
    }
}

export const getCookies = async () => {
    const _cookies = await cookies()
    const accessToken = _cookies.get(AUTH_COOKIE_LABEL)?.value
    const refreshToken = _cookies.get(REFRESH_COOKIE_LABEL)?.value
    return {
        accessToken, refreshToken
    }
}

export const clearAuthCookies = async () => {
    const jar = await cookies()
    const opts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        expires: new Date(0),
    }
    jar.set({ name: AUTH_COOKIE_LABEL, value: '', ...opts })
    jar.set({ name: REFRESH_COOKIE_LABEL, value: '', ...opts })
}

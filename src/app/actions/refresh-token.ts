'use server'
import { clearAuthCookies, getCookies, setJwtCookie } from "../lib/cookies"
import { AUTH_COOKIE_LABEL, REFRESH_COOKIE_LABEL, ResponseType, serverUrl } from "../lib/definitions"

export const refreshToken = async (): Promise<ResponseType> => {
    const { refreshToken: token } = await getCookies()

    if (!token) {
        await clearAuthCookies()
        return { ok: false, payload: null, unauthenticated: true, message: 'No refresh token found' }
    }

    try {
        const url = new URL('auth/refresh-token', serverUrl).toString()
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token }),
            cache: 'no-store',
        })

        const data = await res.json()

        if (res.ok && data?.data?.data?.accessToken) {
            const newAccess = data.data.data.accessToken
            const newRefresh = data.data.data.refreshToken || token 

            await setJwtCookie(AUTH_COOKIE_LABEL, newAccess)
            await setJwtCookie(REFRESH_COOKIE_LABEL, newRefresh)

            return { ok: true, payload: data, unauthenticated: false, message: 'Token refreshed' }
        }

        await clearAuthCookies()
        return { 
            ok: false, 
            payload: data, 
            unauthenticated: true, 
            message: data?.message || 'Failed to refresh token' 
        }

    } catch (error) {
        console.error('Refresh token error:', error)
        await clearAuthCookies()
        return { ok: false, payload: null, unauthenticated: true, message: 'Server unreachable during refresh' }
    }
}
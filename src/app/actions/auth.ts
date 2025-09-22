'use server'
import { parse as parseSetCookie } from 'set-cookie-parser'
import { AUTH_COOKIE_LABEL, FormState, REFRESH_COOKIE_LABEL, serverUrl, SignInFormSchema } from '../lib/definitions'
import { clearAuthCookies, getCookies, setJwtCookie } from '../lib/cookies'
import { redirect } from 'next/navigation'

const setCookiesFn = async (res: Response) => {
    const setCookies = res.headers.getSetCookie?.()
    const parsed = parseSetCookie(setCookies, { map: true })
    const access = parsed['Authentication']?.value ?? parsed['accessToken']?.value
    const refresh = parsed['Refresh']?.value ?? parsed['refreshToken']?.value
    if (!access || !refresh) return { message: 'Internal Server Error, contact admin' }
    await setJwtCookie(AUTH_COOKIE_LABEL, access)
    await setJwtCookie(REFRESH_COOKIE_LABEL, refresh)
}

// tiny guard to avoid open redirect
function safeInternalRedirect(dest: unknown, fallback = '/') {
    if (typeof dest !== 'string') return fallback
    try {
        // allow only same-origin relative paths
        return dest.startsWith('/') && !dest.startsWith('//') ? dest : fallback
    } catch {
        return fallback
    }
}

export async function signIn(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const parsed = SignInFormSchema.safeParse({
        email: formData.get('login__email'),
        password: formData.get('login__password'),
    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const continueTo = formData.get('continue')
    const { email, password } = parsed.data;

    try {
        const url = new URL('auth/login', serverUrl).toString()
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        const data = await res.json()

        if (!res.ok || data?.error) {
            const msg = res.status === 401 ? 'Invalid credentials' : 'Internal Server Error, Please contact Admin'
            return { message: msg }
        }

        await setCookiesFn(res)
    } catch (e) {
        console.error(e)
        return { message: 'Server unreachable. Try again.' }
    }

    // redirect to intended destination (safe)
    redirect(safeInternalRedirect(continueTo, '/'))
}

export async function signOut(): Promise<{ ok: boolean; redirectTo: string }> {
    const { accessToken } = await getCookies()

    try {
        await fetch(new URL('auth/logout', serverUrl).toString(), {
            method: 'POST',
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                Accept: 'application/json',
            },
            credentials: 'include',
            cache: 'no-store',
        }).catch(() => { }) // swallow network issues; we still clear local cookies
    } finally {
        await clearAuthCookies()
    }

    // don't call redirect() here in dev
    return { ok: true, redirectTo: '/login' }
}

'use server'
import { parse as parseSetCookie } from 'set-cookie-parser'
import { AUTH_COOKIE_LABEL, FormState, REFRESH_COOKIE_LABEL, serverUrl, SignInFormSchema } from '../lib/definitions'
import { clearAuthCookies, getCookies, setJwtCookie } from '../lib/cookies'
import { redirect } from 'next/navigation'
import { _post } from '../lib/methods'

const setCookiesFn = async (res: Response) => {
    const setCookies = res.headers.getSetCookie?.() // Node 18+ fetch polyfills may support this
    // If not available, keep using axios ONLY to read raw set-cookie headers.

    const parsed = parseSetCookie(setCookies, { map: true })

    const access = parsed['Authentication']?.value ?? parsed['accessToken']?.value
    const refresh = parsed['Refresh']?.value ?? parsed['refreshToken']?.value

    if (!access || !refresh) {
        console.log('ERR::Expected auth cookies not present', parsed)
        return { message: 'Internal Server Error, contact admin' }
    }

    await setJwtCookie(AUTH_COOKIE_LABEL, access)
    await setJwtCookie(REFRESH_COOKIE_LABEL, refresh)
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
        return { message: 'Server unreachable. Try again.' }
    }
    redirect('/')
}
export async function signOut() {
    const { accessToken } = await getCookies()

    try {
        // Call your NestJS logout to revoke the server-side session.
        // Use absolute URL + proper scheme + Authorization header.
        await fetch(new URL('auth/logout', serverUrl).toString(), {
            method: 'POST',
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                Accept: 'application/json',
            },
            // If your Nest side uses its own httpOnly cookies (same domain),
            // include credentials. For cross-site, ensure CORS + credentials set up.
            credentials: 'include',
            cache: 'no-store',
        }).catch(() => {
            // swallow network errors; we still clear local cookies in finally
        })
    } finally {
        // Always clear local Next.js cookies so UI/auth state resets deterministically
        await clearAuthCookies()
    }

    redirect('/')
}

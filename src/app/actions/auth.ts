'use server'
import { parse as parseSetCookie } from 'set-cookie-parser'
import { AUTH_COOKIE_LABEL, LoginFormState, IS_ADMIN_COOKIE_LABEL, REFRESH_COOKIE_LABEL, serverUrl, SignInFormSchema, SetPasswordFormState, SetPasswordFormSchema, ResponseType } from '../lib/definitions'
import { clearAuthCookies, getCookies, setJwtCookie } from '../lib/cookies'
import { redirect } from 'next/navigation'
import { _get, _patch } from '../lib/methods'

const setCookiesFn = async (res: Response, data?: any) => {
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
    state: LoginFormState,
    formData: FormData
): Promise<LoginFormState> {
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

        await setCookiesFn(res, data)
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

export async function setPasswordAction(
    state: SetPasswordFormState,
    formData: FormData
): Promise<SetPasswordFormState> {
    const tokenRaw = formData.get("token");
    if (typeof tokenRaw !== "string" || !tokenRaw) {
        return { message: "Missing or invalid token" };
    }

    const parsed = SetPasswordFormSchema.safeParse({
        password: formData.get('set_password__password'),
        confirmPassword: formData.get('set_password__confirmPassword'),
    })
    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors }
    }

    const { password, confirmPassword } = parsed.data;

    if (password !== confirmPassword) {
        return { errors: { confirmPassword: ['Passwords do not match'] } }
    }

    try {
        const url = new URL(`users/redeem/${encodeURIComponent(tokenRaw)}`, serverUrl).toString();
        const res = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        const data = await res.json()

        if (!res.ok || data?.error) {
            const msg = res.status === 401 ? 'Invalid credentials' : 'Internal Server Error, Please contact Admin'
            return { message: msg }
        }

        safeInternalRedirect('/login', '/login');
        return {
            message: 'Password set successfully. Redirecting to login...',
        };

    } catch (err) {
        return { errors: {}, message: "Network or server error while setting password" };
    }
}

export const verifyToken = async (token: string): Promise<ResponseType> => {
    const profileRes = await _patch<null>(`password-token/verify/${token}`, null, false);
    return profileRes;
}

export const redeemToken = async (token: string, password: string): Promise<ResponseType> => {
    const profileRes = await _patch<null>(`password-token/redeem/${token}`, null, false);
    return profileRes;
}
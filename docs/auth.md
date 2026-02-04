# Frontend Auth Guide (Next.js + External Backend)

This is a simple, step-by-step guide to build login protection in a Next.js app using cookies and server sessions from an external backend. It is written for beginners.

Goal: users can log in, stay logged in, and only see protected pages if they are signed in.

---

## Big Idea (In Plain English)

- The backend creates a session when the user logs in.
- The backend sends a cookie called `sid` (session id).
- Next.js forwards that cookie to the browser.
- The browser sends that cookie on every request.
- Next.js checks the cookie before showing protected pages.

No access tokens. No refresh tokens. Just one `sid` cookie.

---

## Step 1: Decide What You Protect

Pick the routes that should be protected. Examples:

- `/dashboard`
- `/settings`
- `/admin`

Add these to middleware.

File: `muslimgive_frontend/src/middleware.ts`

```ts
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
```

---

## Step 2: Login Form Calls a Server Action

Your login form should submit to a server action (not a client-side fetch).

File: `muslimgive_frontend/src/app/actions/auth.ts`

```ts
'use server'
import { cookies } from 'next/headers'

export async function signIn(state, formData) {
  const email = formData.get('login__email')
  const password = formData.get('login__password')

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const setCookie = res.headers.getSetCookie?.()
  // parse cookie and forward (see Step 3)
}
```

---

## Step 3: Forward the Cookie to the Browser

The backend sets `Set-Cookie: sid=...`.  
Next.js must forward that cookie to the browser.

File: `muslimgive_frontend/src/app/actions/auth.ts`

```ts
import { parse as parseSetCookie } from 'set-cookie-parser'
import { cookies } from 'next/headers'

const setCookiesFn = async (res: Response) => {
  const setCookies = res.headers.getSetCookie?.()
  const parsed = parseSetCookie(setCookies, { map: true })
  const sessionCookie = parsed['sid']
  if (!sessionCookie?.value) return

  const jar = await cookies()
  jar.set({
    name: 'sid',
    value: sessionCookie.value,
    httpOnly: sessionCookie.httpOnly ?? true,
    secure: sessionCookie.secure ?? false,
    sameSite: (sessionCookie.sameSite ?? 'lax') as 'lax' | 'strict' | 'none',
    path: sessionCookie.path ?? '/',
  })
}
```

Important:
- If you call the backend directly from the browser, the cookie is set on the backend domain and the frontend will not see it.
- Always forward the cookie through a Next.js server action.

---

## Step 4: Protect Routes With Middleware

In `middleware.ts`, do two checks:

1. If `sid` cookie is missing, redirect to `/login`.
2. If `sid` exists, call `GET /auth/session` on the backend.

File: `muslimgive_frontend/src/middleware.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('sid')?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/auth/session`, {
    headers: { cookie: `sid=${encodeURIComponent(token)}` },
    cache: 'no-store',
  })

  if (!res.ok) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}
```

---

## Step 5: Use Cookies for API Calls

When your server actions call the backend:

- Do not send `Authorization: Bearer ...`
- Send the `sid` cookie

File: `muslimgive_frontend/src/app/lib/methods.ts`

```ts
const headers: Record<string, string> = { Accept: 'application/json' };
headers.cookie = `sid=${encodeURIComponent(accessToken)}`

const res = await fetch(url, {
  method: 'GET',
  headers,
  cache: 'no-store',
})
```

---

## Step 6: Logout

Logout should:

1. Call `POST /auth/logout`
2. Backend revokes session and clears `sid`
3. Frontend clears its cookie

File: `muslimgive_frontend/src/app/actions/auth.ts`

```ts
export async function signOut() {
  const jar = await cookies()
  const sid = jar.get('sid')?.value

  await fetch(`${process.env.NEXT_PUBLIC_SERVER}/auth/logout`, {
    method: 'POST',
    headers: { cookie: `sid=${encodeURIComponent(sid ?? '')}` },
    cache: 'no-store',
  })
}
```

---

## Step 7: Handling Backend Down

If the backend is down, fetch will fail.  
Your app should treat the user as logged out and not crash.

File: `muslimgive_frontend/src/app/lib/methods.ts`

```ts
try {
  const res = await fetch(url, { headers });
  // normal flow
} catch {
  return { ok: false, unauthenticated: true, payload: null };
}
```

---

## Common Mistakes

- Logging in via browser fetch directly to backend (cookie is on wrong domain).
- Forgetting to forward `Set-Cookie` in Next.js server action.
- Still using refresh tokens or access tokens (not needed).
- Not checking session validity in middleware.

---

## Quick Checklist

- `sid` cookie exists in browser
- Middleware checks `/auth/session`
- All API calls use cookie, not Authorization header
- Logout revokes session and clears cookie

---

## One Sentence Summary

Use a server action to forward the backend `sid` cookie to the frontend, then protect routes by checking that cookie and validating the session on the backend.

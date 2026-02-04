// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_LABEL, AUTH_ROUTES } from "./constants";
import { serverUrl } from "@/app/lib/definitions";

// tiny helper to preserve the intended dest
function makeLoginUrl(req: NextRequest) {
    const url = new URL("/login", req.url);
    const dest = req.nextUrl.pathname + req.nextUrl.search;
    url.searchParams.set("continue", dest);
    return url;
}

export const middlewareFn = async (req: NextRequest) => {
    const { pathname } = req.nextUrl;
    const needsAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));
    if (!needsAuth) return NextResponse.next();

    const token = req.cookies.get(`${AUTH_COOKIE_LABEL}`)?.value;
    if (!token) {
        // unauthenticated → go to login with ?continue=
        return NextResponse.redirect(makeLoginUrl(req));
    }

    try {
        if (!serverUrl) {
            return NextResponse.redirect(makeLoginUrl(req));
        }
        const cookieHeader = req.headers.get('cookie') || `${AUTH_COOKIE_LABEL}=${encodeURIComponent(token)}`;
        const res = await fetch(new URL('auth/session', serverUrl).toString(), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                cookie: cookieHeader,
            },
            cache: 'no-store',
        });
        if (!res.ok) {
            return NextResponse.redirect(makeLoginUrl(req));
        }
    } catch {
        return NextResponse.redirect(makeLoginUrl(req));
    }

    return NextResponse.next();

}

export const configObj = (paths: string[]) => {
    return {
        matcher: paths.map((p) => `${p}/:path*`),
    }
}


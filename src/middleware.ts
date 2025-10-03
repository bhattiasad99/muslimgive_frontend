// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { ADMIN_ROUTES, AUTH_COOKIE_LABEL, AUTH_ROUTES } from "./app/lib/definitions";

// tiny helper to preserve the intended dest
function makeLoginUrl(req: NextRequest) {
    const url = new URL("/login", req.url);
    const dest = req.nextUrl.pathname + req.nextUrl.search;
    url.searchParams.set("continue", dest);
    return url;
}

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const needsAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));
    const needsAdmin = ADMIN_ROUTES.some((p) => pathname.startsWith(p));

    if (!needsAuth) return NextResponse.next();

    const token = req.cookies.get(`${AUTH_COOKIE_LABEL}`)?.value;
    if (!token) {
        // unauthenticated → go to login with ?continue=
        return NextResponse.redirect(makeLoginUrl(req));
    }

    if (needsAdmin) {
        try {
            const decoded: any = jwtDecode(token); // decode only, no verify here
            if (!decoded?.isAdmin) {
                // logged-in but not admin → unauthorized
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        } catch {
            // bad/expired token → treat like unauthenticated
            return NextResponse.redirect(makeLoginUrl(req));
        }
    }

    return NextResponse.next();
}

// Scope the middleware to only the paths we actually guard
export const config = {
    matcher: [
        "/charities/:path*",
        "/my-profile/:path*",
        "/users/:path*",
        "/access-control/:path*",
    ],
};

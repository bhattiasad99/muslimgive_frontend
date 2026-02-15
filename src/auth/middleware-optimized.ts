import { NextRequest, NextResponse } from "next/server";

// Fast middleware: only check for presence of the session cookie.
// The backend remains the source of truth for auth/authorization.
export const middlewareFn = async (req: NextRequest) => {
    const token = req.cookies.get('sid')?.value;

    if (!token) {
        const url = new URL('/login', req.url);
        const dest = req.nextUrl.pathname + req.nextUrl.search;
        url.searchParams.set('continue', dest);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
};

export const configObj = (paths: string[]) => ({
    matcher: paths,
});

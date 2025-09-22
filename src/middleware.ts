import { NextRequest, NextResponse } from "next/server";
import { baseEndPoint } from "./app/actions/general";

export default async function middleware(req: NextRequest) {
    // only guard /charities/*; your matcher handles scope
    const { ok, unauthenticated } = await baseEndPoint();

    if (unauthenticated || !ok) {
        const loginUrl = new URL("/login", req.url);

        // preserve full path + query
        const dest = req.nextUrl.pathname + req.nextUrl.search;
        loginUrl.searchParams.set("continue", dest);

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// apply only to /charities and its children
export const config = {
    matcher: ["/charities/:path*", "/access-control/:path*", "/charities/:path*", '/profile/:path*', "/users/:path*"],
};

import { NextRequest } from "next/server";
import { middlewareFn } from "@/auth/middleware";

export default async function middleware(req: NextRequest) {
    return middlewareFn(req);
}

export const config = {
    matcher: [
        "/charities/:path*",
        "/profile/:path*",
        "/users/:path*",
        "/access-control/:path*",
        "/email-logs/:path*",
        "/create-charity/:path*",
    ],
};

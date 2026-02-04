import { NextRequest } from "next/server";
import { configObj, middlewareFn } from "@/auth/middleware";

export default async function middleware(req: NextRequest) {
    return middlewareFn(req);
}

const MATCHER_PATHS = [
    "/charities",
    "/profile",
    "/users",
    "/access-control",
    "/email-logs",
    "/create-charity"
]

export const config = configObj(MATCHER_PATHS)
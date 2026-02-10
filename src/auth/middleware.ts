// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authAdapter } from "./adapters";

export const middlewareFn = async (req: NextRequest) => {
    const result = await authAdapter.handleMiddleware(req);
    return result ?? NextResponse.next();
}


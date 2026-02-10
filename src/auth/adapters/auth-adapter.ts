import type { NextRequest, NextResponse } from 'next/server';

/**
 * Defines the contract every auth strategy must fulfil.
 *
 * To swap auth backends (e.g. Clerk, NextAuth, Supabase Auth):
 *   1. Create a new class implementing AuthAdapter
 *   2. Change the export in `./index.ts`
 *
 * The rest of the app (HTTP helpers, middleware, server actions)
 * depends only on this interface — never on concrete cookie logic.
 */
export interface AuthAdapter {
    /**
     * Return the raw credential / session token that should be
     * forwarded to the backend, or `null` if unauthenticated.
     */
    getToken(): Promise<string | null>;

    /**
     * Build the headers that authenticate a request to the backend.
     * For cookies this is `{ cookie: "sid=..." }`;
     * for Bearer tokens it would be `{ Authorization: "Bearer ..." }`.
     * Returns an empty object when there is no token.
     */
    getAuthHeaders(): Promise<Record<string, string>>;

    /**
     * Optionally refresh / extend the session.
     * Implementations that don't support refresh can no-op.
     */
    maybeRefresh(): Promise<void>;

    /**
     * Process the Set-Cookie (or equivalent) headers from a backend
     * response so the token is persisted for subsequent requests.
     */
    persistTokenFromResponse(res: Response): Promise<void>;

    /**
     * Middleware hook — validate the session and return a redirect
     * response if invalid, or `null` to let the request through.
     */
    handleMiddleware(request: NextRequest): Promise<NextResponse | null>;
}

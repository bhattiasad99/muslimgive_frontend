export const AUTH_COOKIE_LABEL = 'sid';
export const AUTH_REFRESH_MARKER = 'sid_rf';

// Refresh at most twice a day to keep sessions alive while active.
export const SESSION_REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000;

export const AUTH_ROUTES = [
    "/charities",
    "/profile",
    "/users",
    "/access-control",
    "/email-logs",
    "/create-charity"
];

export const ADMIN_ROUTES = ["/users", "/access-control"];

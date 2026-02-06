export const AUTH_COOKIE_LABEL = 'sid';
export const AUTH_REFRESH_MARKER = 'sid_rf';

// Refresh session every 15 minutes for better performance
export const SESSION_REFRESH_INTERVAL_MS = 15 * 60 * 1000;

export const AUTH_ROUTES = [
    "/charities",
    "/profile",
    "/users",
    "/access-control",
    "/email-logs",
    "/create-charity"
];

export const ADMIN_ROUTES = ["/users", "/access-control"];

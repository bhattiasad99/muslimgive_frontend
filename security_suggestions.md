Here’s a security-focused review of the auth/cookie structure. Findings first, ordered by severity.

Findings

Critical: An EC private key is committed in the repo. PrivateKey.pem This is a real private key. If it’s used anywhere (JWT signing, encryption, etc.), it’s compromised and must be rotated and removed from the repo.
High: Route protection mismatch — middleware only runs on the matcher, so several “auth routes” are not actually guarded. middleware.ts (line 27) vs definitions.ts (line 66)
AUTH_ROUTES includes /profile, /email-logs, /create-charity, but the matcher includes /my-profile and omits /email-logs and /create-charity. Any unauth user can hit those routes without middleware redirect.
High: Permission gating is client‑only, so server HTML can render protected content before the client gate runs. layout.tsx (line 14) and PermissionGate.tsx (line 1)
This is especially risky given the middleware gaps above. If a route misses middleware, content can be SSR’d to unauth users even if the client eventually shows “Not Authorized.”
Medium: Admin UI access relies on an unverified JWT claim. SidebarComponent.tsx (line 28)
jwtDecode does not verify signature. A forged cookie could flip isAdmin and expose admin menus/routes client‑side. (Backend should still enforce, but UI gating becomes meaningless.)
Medium: Cookie expiry assumes every token is a JWT with exp. cookies.ts (line 11)
If the refresh token is opaque or missing exp, setJwtCookie throws and silently skips setting the cookie, causing inconsistent auth state or logouts.
Low: Middleware only checks presence of the access token, not expiry. middleware.ts (line 18)
Stale/forged tokens pass the middleware; you’re relying on backend 401 + refresh later. Usually OK, but it weakens page‑level gatekeeping.
Open questions / assumptions

Is the refresh token definitely a JWT with exp? If it’s opaque, the current cookie setting will fail.
Are /email-logs and /create-charity intended to be protected? If yes, they are currently exposed.
Is PrivateKey.pem a test key or used in production flows?
No code changes made.

If you want, I can help fix these. Suggested next steps:

Remove PrivateKey.pem, rotate any affected secrets, and add it to .gitignore.
Align middleware matcher with AUTH_ROUTES (or guard the whole dashboard subtree).
Move permission checks server‑side (redirect in layout if unauthorized), and avoid trusting unverified JWT claims for admin UI.

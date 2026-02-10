export type { AuthAdapter } from './auth-adapter';
export { CookieAuthAdapter } from './cookie-adapter';

import { CookieAuthAdapter } from './cookie-adapter';
import type { AuthAdapter } from './auth-adapter';

/**
 * The active auth adapter for the application.
 *
 * To swap auth strategies, change this single line:
 *   export const authAdapter: AuthAdapter = new ClerkAuthAdapter();
 */
export const authAdapter: AuthAdapter = new CookieAuthAdapter();

/** Path prefixes that require a session (optimistic check in `proxy.ts`). */
export const PROTECTED_PREFIXES = ["/dashboard"] as const

export const SIGN_IN_PATH = "/sign-in"
export const DASHBOARD_PATH = "/dashboard"
export const OAUTH_CALLBACK_PATH = "/auth/callback"
/** Clears the session cookie, then goes to sign-in (the backend rejected the token). */
export const SESSION_EXPIRED_PATH = "/auth/expired"

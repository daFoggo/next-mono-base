/** Path prefixes that require a session (optimistic check in `proxy.ts`). */
export const PROTECTED_PREFIXES = ["/dashboard"] as const

export const SIGN_IN_PATH = "/sign-in"
export const DASHBOARD_PATH = "/dashboard"
export const OAUTH_CALLBACK_PATH = "/auth/callback"

import type { NextResponse } from "next/server"

/** Provider-agnostic session. `accessToken` is sent as Bearer to the backend. */
export type Session = {
  userId: string
  accessToken: string
}

export type Credentials = {
  email: string
  password: string
}

/** Server-side contract (Server Components, Server Actions). */
export interface AuthProvider {
  /** Verified session, or null. Must not refresh tokens (the proxy does that). */
  getSession(): Promise<Session | null>
  /**
   * Reads the session from the cookies without verification, expiry checks or
   * `connection()`. Only for `"use cache: private"` scopes, which forbid
   * `connection()`; callers must have called `verifySession()` earlier in the
   * request, and the backend still validates the token on every call.
   */
  peekSession(): Promise<Session | null>
  /** Throws on invalid credentials. Only callable from a Server Action / Route Handler. */
  signIn(credentials: Credentials): Promise<void>
  signOut(): Promise<void>
  /** Social login (redirect flow). Only providers that support it implement this. */
  oauth?: {
    /** Returns the URL to send the browser to. */
    start(provider: "google", redirectTo: string): Promise<string>
    /** Completes the flow on the callback route. Throws on failure. */
    exchangeCode(code: string): Promise<void>
  }
}

export type ProxyAuthResult = {
  /** Response to return from `proxy.ts` (carries refreshed cookies). */
  response: NextResponse
  /** Optimistic: a session exists. Real authorization is done in the DAL. */
  isAuthenticated: boolean
}

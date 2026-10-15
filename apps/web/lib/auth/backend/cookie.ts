import type { NextResponse } from "next/server"

import { authConfig } from "../config"

/** Tokens stored in one httpOnly cookie. Expiries are epoch milliseconds. */
export type BackendTokens = {
  accessToken: string
  refreshToken: string
  accessExpiresAt: number
  refreshExpiresAt: number
}

export const ACCESS_REFRESH_SKEW_MS = 2 * 60 * 1000

export function cookieName(): string {
  if (authConfig.AUTH_PROVIDER !== "backend") {
    throw new Error("backend cookie used while AUTH_PROVIDER is not 'backend'")
  }
  return authConfig.SESSION_COOKIE_NAME
}

export const cookieOptions = (tokens: BackendTokens) =>
  ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(tokens.refreshExpiresAt),
  }) as const

export const serialize = (tokens: BackendTokens): string =>
  encodeURIComponent(JSON.stringify(tokens))

export function parse(raw: string | undefined): BackendTokens | null {
  if (!raw) return null
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as Partial<BackendTokens>
    if (
      typeof value.accessToken === "string" &&
      typeof value.refreshToken === "string" &&
      typeof value.accessExpiresAt === "number" &&
      typeof value.refreshExpiresAt === "number"
    ) {
      return value as BackendTokens
    }
  } catch {
    // malformed cookie -> treated as no session
  }
  return null
}

/** Accepts ISO strings or unix seconds/milliseconds (backend format is not fixed). */
export function parseExpirationMs(raw: string | number): number {
  if (typeof raw === "number") return raw > 1e12 ? raw : raw * 1000
  const iso = Date.parse(raw)
  if (!Number.isNaN(iso)) return iso
  const n = Number(raw)
  return n > 1e12 ? n : n * 1000
}

export function setOnResponse(response: NextResponse, tokens: BackendTokens) {
  response.cookies.set(cookieName(), serialize(tokens), cookieOptions(tokens))
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { z } from "zod"

import { apiUrl } from "@/lib/url"

import { authConfig } from "../config"
import type { ProxyAuthResult } from "../types"
import {
  ACCESS_REFRESH_SKEW_MS,
  cookieName,
  parse,
  parseExpirationMs,
  serialize,
  setOnResponse,
  type BackendTokens,
} from "./cookie"

const refreshSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expiration: z.union([z.string(), z.number()]),
  refresh_expiration: z.union([z.string(), z.number()]),
})

async function refresh(tokens: BackendTokens): Promise<BackendTokens | null> {
  if (authConfig.AUTH_PROVIDER !== "backend") return null
  try {
    const res = await fetch(apiUrl(authConfig.API_BASE_URL, "auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refreshToken }),
    })
    if (!res.ok) return null
    const body = refreshSchema.parse(await res.json())
    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      accessExpiresAt: parseExpirationMs(body.expiration),
      refreshExpiresAt: parseExpirationMs(body.refresh_expiration),
    }
  } catch {
    return null
  }
}

/**
 * The only place that refreshes backend tokens (Server Components cannot write
 * cookies, and refreshing in two places can invalidate single-use refresh tokens).
 */
export async function updateSession(
  request: NextRequest
): Promise<ProxyAuthResult> {
  const name = cookieName()
  const tokens = parse(request.cookies.get(name)?.value)
  if (!tokens) {
    return { response: NextResponse.next({ request }), isAuthenticated: false }
  }

  const now = Date.now()
  const needsRefresh = tokens.accessExpiresAt - now <= ACCESS_REFRESH_SKEW_MS
  if (!needsRefresh) {
    return { response: NextResponse.next({ request }), isAuthenticated: true }
  }

  const next = tokens.refreshExpiresAt > now ? await refresh(tokens) : null
  if (next) {
    // Make the new tokens visible to Server Components on this very request.
    request.cookies.set(name, serialize(next))
    const response = NextResponse.next({ request })
    setOnResponse(response, next)
    return { response, isAuthenticated: true }
  }

  // Refresh failed: keep going while the access token is still valid, otherwise sign out.
  if (tokens.accessExpiresAt > now) {
    return { response: NextResponse.next({ request }), isAuthenticated: true }
  }
  request.cookies.delete(name)
  const response = NextResponse.next({ request })
  response.cookies.delete(name)
  return { response, isAuthenticated: false }
}

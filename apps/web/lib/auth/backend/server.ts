import "server-only"

import { cookies } from "next/headers"
import { z } from "zod"

import { ApiError } from "@/lib/errors"
import { apiFetch } from "@/lib/http"

import type { AuthProvider, Credentials, Session } from "../types"
import {
  cookieName,
  cookieOptions,
  parse,
  parseExpirationMs,
  serialize,
} from "./cookie"

const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expiration: z.union([z.string(), z.number()]),
  refresh_expiration: z.union([z.string(), z.number()]),
})
const meSchema = z.object({ id: z.string() })

export const backendProvider: AuthProvider = {
  async getSession(): Promise<Session | null> {
    const tokens = parse((await cookies()).get(cookieName())?.value)
    if (!tokens || tokens.accessExpiresAt <= Date.now()) return null

    // The cookie is not trusted for identity: the backend resolves the user.
    try {
      const me = meSchema.parse(
        await apiFetch<unknown>("users/me", { token: tokens.accessToken })
      )
      return { userId: me.id, accessToken: tokens.accessToken }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null
      throw error
    }
  },

  async signIn(credentials: Credentials) {
    const body = tokenSchema.parse(
      await apiFetch<unknown>("auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
    )
    const tokens = {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      accessExpiresAt: parseExpirationMs(body.expiration),
      refreshExpiresAt: parseExpirationMs(body.refresh_expiration),
    }
    const store = await cookies()
    store.set(cookieName(), serialize(tokens), cookieOptions(tokens))
  },

  async signOut() {
    const store = await cookies()
    store.delete(cookieName())
  },
}

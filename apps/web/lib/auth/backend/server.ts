import "server-only"

import { cookies } from "next/headers"
import { connection } from "next/server"
import { z } from "zod"

import { apiFetch } from "@/lib/http"

import type {
  AuthProvider,
  Credentials,
  Session,
  SignUpInput,
  SignUpResult,
} from "../types"
import {
  cookieName,
  cookieOptions,
  parseExpirationMs,
  seal,
  unseal,
} from "./cookie"

const signInSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expiration: z.union([z.string(), z.number()]),
  refresh_expiration: z.union([z.string(), z.number()]),
  user_info: z.object({ id: z.string() }),
})

export const backendProvider: AuthProvider = {
  async getSession(): Promise<Session | null> {
    // Opt into request-time rendering before reading the clock (Date.now) below.
    await connection()
    const session = await unseal((await cookies()).get(cookieName())?.value)
    // The seal is authenticated encryption, so the userId can be trusted without
    // asking the backend. The backend still checks the token on every API call.
    if (!session || session.accessExpiresAt <= Date.now()) return null
    return { userId: session.userId, accessToken: session.accessToken }
  },

  async peekSession(): Promise<Session | null> {
    const session = await unseal((await cookies()).get(cookieName())?.value)
    return session
      ? { userId: session.userId, accessToken: session.accessToken }
      : null
  },

  // The backend validates the token and the user's status on every call, so a
  // "fresh" check is the same as a normal session read here.
  async verifySessionFresh(): Promise<Session | null> {
    return backendProvider.getSession()
  },

  async signUp(input: SignUpInput): Promise<SignUpResult> {
    await apiFetch<unknown>("auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    await backendProvider.signIn({ email: input.email, password: input.password })
    return "signed-in"
  },

  async signIn(credentials: Credentials) {
    const body = signInSchema.parse(
      await apiFetch<unknown>("auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
    )
    const session = {
      userId: body.user_info.id,
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      accessExpiresAt: parseExpirationMs(body.expiration),
      refreshExpiresAt: parseExpirationMs(body.refresh_expiration),
    }
    const store = await cookies()
    store.set(cookieName(), await seal(session), cookieOptions(session))
  },

  async signOut() {
    const store = await cookies()
    store.delete(cookieName())
  },
}

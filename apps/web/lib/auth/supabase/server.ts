import "server-only"

import { connection } from "next/server"

import type {
  AuthProvider,
  Credentials,
  Session,
  SignUpInput,
  SignUpResult,
} from "../types"
import { createClient } from "./client"

export const supabaseProvider: AuthProvider = {
  async getSession(): Promise<Session | null> {
    // getClaims checks token expiry against the clock: opt into request-time rendering first.
    await connection()
    const supabase = await createClient()
    // getClaims verifies the JWT signature; getSession alone must not be trusted.
    const { data: claims } = await supabase.auth.getClaims()
    const userId = claims?.claims.sub
    if (!userId) return null

    // Only used to forward the (already verified) token to the backend.
    const { data } = await supabase.auth.getSession()
    if (!data.session) return null
    return { userId, accessToken: data.session.access_token }
  },

  async peekSession(): Promise<Session | null> {
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()
    if (!data.session) return null
    return {
      userId: data.session.user.id,
      accessToken: data.session.access_token,
    }
  },

  async verifySessionFresh(): Promise<Session | null> {
    await connection()
    const supabase = await createClient()
    // getUser asks the Auth server, so revoked sessions are rejected.
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) return null
    return { userId: data.user.id, accessToken: sessionData.session.access_token }
  },

  async signUp({ name, email, password }: SignUpInput): Promise<SignUpResult> {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    // No session means the project requires email confirmation first.
    return data.session ? "signed-in" : "confirm-email"
  },

  async signIn(credentials: Credentials) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(credentials)
    if (error) throw error
  },

  async signOut() {
    const supabase = await createClient()
    // "local" ends this browser's session only; the default "global" revokes every device.
    const { error } = await supabase.auth.signOut({ scope: "local" })
    if (error) throw error
  },

  oauth: {
    async start(provider, redirectTo) {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      })
      if (error) throw error
      return data.url
    },

    async exchangeCode(code) {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
    },
  },
}

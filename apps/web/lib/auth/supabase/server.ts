import "server-only"

import type { AuthProvider, Credentials, Session } from "../types"
import { createClient } from "./client"

export const supabaseProvider: AuthProvider = {
  async getSession(): Promise<Session | null> {
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

  async signIn(credentials: Credentials) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(credentials)
    if (error) throw error
  },

  async signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
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

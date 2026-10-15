import { z } from "zod"

/**
 * Auth environment. Deliberately free of `server-only` so `proxy.ts` can use it.
 * `SESSION_SECRET` is secret: it is read without a `NEXT_PUBLIC_` prefix, so it
 * is never inlined into client code, but client components must not import this
 * module (enforced by an ESLint rule).
 *
 * Exactly one provider is active per deployment (`AUTH_PROVIDER`).
 * Referencing `process.env.X` literally keeps `NEXT_PUBLIC_*` inlinable.
 */
const authSchema = z.discriminatedUnion("AUTH_PROVIDER", [
  z.object({
    AUTH_PROVIDER: z.literal("backend"),
    API_BASE_URL: z.url(),
    SESSION_COOKIE_NAME: z.string().min(1),
    SESSION_SECRET: z.string().min(32),
  }),
  z.object({
    AUTH_PROVIDER: z.literal("supabase"),
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  }),
])

export type AuthConfig = z.infer<typeof authSchema>

export const authConfig: AuthConfig = authSchema.parse({
  AUTH_PROVIDER: process.env.AUTH_PROVIDER ?? "backend",
  API_BASE_URL: process.env.API_BASE_URL ?? "http://localhost:8000",
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME ?? "session",
  SESSION_SECRET: process.env.SESSION_SECRET,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
})

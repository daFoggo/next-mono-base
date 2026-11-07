import "server-only"

import { z } from "zod"

/**
 * Validated server-side environment. Server-only: secrets never reach the client.
 * Public (`NEXT_PUBLIC_*`) variables live in `env.public.ts`.
 *
 * Every variable read here must also be declared in `turbo.json` (`build.env`),
 * otherwise Turborepo's strict env mode hides it from the task.
 *
 * `AUTH_PROVIDER` picks the whole stack, data included (docs/providers.md): `neon-auth` runs on Neon Postgres
 * (`DATABASE_URL`), every other provider on the bounded in-memory store until it gets its own data path.
 */
const serverSchema = z.object({
  API_BASE_URL: z.url().default("http://localhost:8000"),
  AUTH_PROVIDER: z.string().default("neon-auth"),
  DATABASE_URL: z.string().optional(),
})

export type ServerEnv = z.infer<typeof serverSchema>

/**
 * `next build` runs without live runtime secrets (same rule as `parseAuthConfig`): `DATABASE_URL` is required
 * for `neon-auth` only at runtime, where the first query would otherwise fail with a less clear message.
 */
export function parseServerEnv(
  raw: Record<string, string | undefined> = process.env
): ServerEnv {
  const isBuildPhase =
    raw.NEXT_PHASE === "phase-production-build" ||
    raw.SKIP_ENV_VALIDATION === "true" ||
    raw.SKIP_ENV_VALIDATION === "1"
  const env = serverSchema.parse({
    API_BASE_URL: raw.API_BASE_URL || undefined,
    AUTH_PROVIDER: raw.AUTH_PROVIDER || undefined,
    DATABASE_URL: raw.DATABASE_URL || undefined,
  })
  if (env.AUTH_PROVIDER === "neon-auth" && !env.DATABASE_URL && !isBuildPhase) {
    throw new Error("DATABASE_URL is required when AUTH_PROVIDER=neon-auth")
  }
  return env
}

export const env = parseServerEnv()

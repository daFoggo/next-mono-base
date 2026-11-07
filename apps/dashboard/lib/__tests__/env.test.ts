import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

import { parseServerEnv } from "../env"

const URL = "postgresql://u:p@h/db"

describe("parseServerEnv", () => {
  it("defaults to neon-auth", () => {
    expect(parseServerEnv({ DATABASE_URL: URL }).AUTH_PROVIDER).toBe(
      "neon-auth"
    )
  })

  it("requires DATABASE_URL for neon-auth at runtime", () => {
    expect(() => parseServerEnv({})).toThrow("DATABASE_URL is required")
    expect(() => parseServerEnv({ AUTH_PROVIDER: "neon-auth" })).toThrow(
      "DATABASE_URL is required"
    )
  })

  it("lets next build run without DATABASE_URL", () => {
    expect(() =>
      parseServerEnv({ NEXT_PHASE: "phase-production-build" })
    ).not.toThrow()
    expect(() => parseServerEnv({ SKIP_ENV_VALIDATION: "1" })).not.toThrow()
  })

  it.each(["demo", "supabase", "keycloak", "fastapi-oauth"])(
    "needs no database with %s",
    (AUTH_PROVIDER) => {
      expect(parseServerEnv({ AUTH_PROVIDER }).DATABASE_URL).toBeUndefined()
    }
  )

  it("treats an empty variable as unset", () => {
    expect(() => parseServerEnv({ DATABASE_URL: "" })).toThrow(
      "DATABASE_URL is required"
    )
  })
})

import { NextRequest } from "next/server"
import { SignJWT } from "jose"
import { beforeEach, describe, expect, it, vi } from "vitest"

const SECRET = "change-me-to-a-random-64-char-secret"
const state = vi.hoisted(() => ({
  refresh: (async () => {
    throw new Error("unset")
  }) as () => Promise<unknown>,
  keycloakClaims: null as null | { userId: string; role: string; exp: number },
}))

vi.mock("../fastapi-oauth/client", async (importActual) => ({
  ...(await importActual<typeof import("../fastapi-oauth/client")>()),
  refreshTokens: () => state.refresh(),
}))
vi.mock("../keycloak/oidc", async (importActual) => ({
  ...(await importActual<typeof import("../keycloak/oidc")>()),
  refreshKeycloakTokens: () => state.refresh(),
}))
vi.mock("../keycloak/jwks", () => ({
  verifyKeycloakJwt: async () => state.keycloakClaims,
}))

const { FastApiAuthError } = await import("../fastapi-oauth/client")
const { KeycloakTokenError } = await import("../keycloak/oidc")
const fastapi = await import("../fastapi-oauth/proxy")
const keycloak = await import("../keycloak/proxy")
const { verifyFastApiJwt } = await import("../fastapi-oauth/jwt")

const now = () => Math.floor(Date.now() / 1000)

async function fastApiToken(expiresIn: number | null) {
  const jwt = new SignJWT({ type: "access", role: "member" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("u1")
  if (expiresIn !== null) jwt.setExpirationTime(now() + expiresIn)
  return jwt.sign(new TextEncoder().encode(SECRET))
}

function request(cookies: Record<string, string>) {
  return new NextRequest("http://localhost:3000/dashboard", {
    headers: {
      cookie: Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join("; "),
    },
  })
}

const OPTIONS = { cookieName: "app" }

describe.each([
  {
    name: "fastapi-oauth",
    proxy: fastapi,
    cookies: async (access: boolean) => ({
      ...(access ? { "app.access": await fastApiToken(30) } : {}),
      "app.refresh": "r",
    }),
    reject: () => new FastApiAuthError(401, "bad refresh token"),
    prepare: () => undefined,
  },
  {
    name: "keycloak",
    proxy: keycloak,
    cookies: async (access: boolean) => ({
      ...(access ? { "app.access": "a" } : {}),
      "app.refresh": "r",
    }),
    reject: () => new KeycloakTokenError(400, "invalid_grant"),
    prepare: () => {
      state.keycloakClaims = { userId: "u1", role: "customer", exp: now() + 30 }
    },
  },
])("$name refresh", ({ proxy, cookies, reject, prepare }) => {
  beforeEach(() => {
    state.keycloakClaims = null
    prepare()
  })

  it("keeps the cookies and a still-valid token during an outage", async () => {
    state.refresh = async () => {
      throw new TypeError("fetch failed")
    }
    const result = await proxy.updateSession(
      request(await cookies(true)),
      OPTIONS
    )
    expect(result.isAuthenticated).toBe(true)
    expect(result.response.cookies.getAll()).toEqual([])
  })

  it("keeps the cookies but reports signed out when no token is left", async () => {
    state.keycloakClaims = null
    state.refresh = async () => {
      throw new TypeError("fetch failed")
    }
    const result = await proxy.updateSession(
      request(await cookies(false)),
      OPTIONS
    )
    expect(result.isAuthenticated).toBe(false)
    expect(result.response.cookies.getAll()).toEqual([])
  })

  it("treats a 5xx like an outage", async () => {
    state.refresh = async () => {
      throw proxy === fastapi
        ? new FastApiAuthError(503, "down")
        : new KeycloakTokenError(503, "down")
    }
    const result = await proxy.updateSession(
      request(await cookies(false)),
      OPTIONS
    )
    expect(result.isAuthenticated).toBe(false)
    expect(result.response.cookies.getAll()).toEqual([])
  })

  it("clears the cookies when the refresh token is rejected", async () => {
    state.refresh = async () => {
      throw reject()
    }
    const result = await proxy.updateSession(
      request(await cookies(true)),
      OPTIONS
    )
    expect(result.isAuthenticated).toBe(false)
    expect(result.response.cookies.get("app.refresh")?.value).toBe("")
  })
})

describe("verifyFastApiJwt", () => {
  it("rejects a token without exp", async () => {
    expect(await verifyFastApiJwt(await fastApiToken(null), SECRET)).toBeNull()
  })
  it("accepts a token with exp", async () => {
    expect(
      await verifyFastApiJwt(await fastApiToken(60), SECRET)
    ).toMatchObject({ userId: "u1" })
  })
})

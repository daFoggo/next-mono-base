import "server-only"

import { redirect } from "next/navigation"

import { SESSION_EXPIRED_PATH } from "@/config/routes"

import { env } from "./env"
import { ApiError } from "./errors"
import { apiUrl } from "./url"

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  /** Bearer token; obtain it from the DAL and pass it in. */
  token?: string
  headers?: Record<string, string>
}

/**
 * Thin fetch wrapper for the backend. Resolves with parsed JSON or throws
 * `ApiError`; it never returns fallback data for failures.
 * Only feature `server.ts` files may import this module.
 */
export async function apiFetch<T>(
  path: string,
  { token, headers, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const res = await fetch(apiUrl(env.API_BASE_URL, path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!res.ok) {
    // A token the session still holds was rejected: end the session (see the route).
    if (res.status === 401 && token) redirect(SESSION_EXPIRED_PATH)
    const body = await res.json().catch(() => undefined)
    // The backend answers with RFC 7807 problem details ({ title, detail, status }).
    const detail =
      body && typeof body === "object" && "detail" in body && typeof body.detail === "string"
        ? body.detail
        : undefined
    throw new ApiError(
      res.status,
      detail ?? `Request failed with status ${res.status}`,
      body
    )
  }

  return (await res.json()) as T
}

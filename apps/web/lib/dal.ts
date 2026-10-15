import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { SIGN_IN_PATH } from "@/config/routes"

import { getAuthProvider, type Session } from "./auth"

export type { Session }

/** Data Access Layer entry point. Memoized per request via React `cache`. */
export const getSession = cache(async (): Promise<Session | null> => {
  const provider = await getAuthProvider()
  return provider.getSession()
})

/**
 * For `"use cache: private"` functions only (they cannot call `connection()`, which
 * `getSession` needs). Call `verifySession()` first in the same request.
 */
export async function peekSession(): Promise<Session> {
  const session = await (await getAuthProvider()).peekSession()
  if (!session) redirect(SIGN_IN_PATH)
  return session
}

/** Call close to the data (queries, actions), not in layouts. */
export const verifySession = cache(async (): Promise<Session> => {
  const session = await getSession()
  if (!session) redirect(SIGN_IN_PATH)
  return session
})

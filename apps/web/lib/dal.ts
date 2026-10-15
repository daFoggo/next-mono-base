import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { SESSION_EXPIRED_PATH } from "@/config/routes"

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
  if (!session) redirect(SESSION_EXPIRED_PATH)
  return session
}

/** Call close to the data (queries, actions), not in layouts. */
export const verifySession = cache(async (): Promise<Session> => {
  const session = await getSession()
  if (!session) redirect(SESSION_EXPIRED_PATH)
  return session
})

/**
 * For sensitive actions (change password, delete account, payments): also confirms with
 * the identity system that the session was not revoked. Costs a network round trip.
 */
export const verifySessionFresh = cache(async (): Promise<Session> => {
  const provider = await getAuthProvider()
  const session = await provider.verifySessionFresh()
  if (!session) redirect(SESSION_EXPIRED_PATH)
  return session
})

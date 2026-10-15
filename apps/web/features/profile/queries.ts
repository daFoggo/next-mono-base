import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { verifySession } from "@/lib/dal"

import type { Profile } from "./schemas"
import { fetchProfile } from "./server"

export const profileTag = (userId: string) => `profile:${userId}`

/**
 * Per-user data: `"use cache: private"` keeps it in the browser only (never in the
 * server cache, where keys and tags are plain text) and may read the session itself.
 * `updateTag(profileTag(userId))` in the update action invalidates it.
 */
export async function getProfile(): Promise<Profile> {
  "use cache: private"
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 })

  const { userId, accessToken } = await verifySession()
  cacheTag(profileTag(userId))
  return fetchProfile(accessToken)
}

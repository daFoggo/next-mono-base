import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { verifySession } from "@/lib/dal"

import type {
  CaseDetail,
  CaseList,
  CaseListParams,
  ExperimentList,
} from "./schemas"
import { fetchCase, fetchCases, fetchExperiments } from "./server"

/** Tags are per user: they live in the browser only, but keep the identity explicit. */
export const experimentsTag = (userId: string) => `experiments:${userId}`
export const casesTag = (userId: string) => `cases:${userId}`
export const caseTag = (userId: string, caseId: string) =>
  `case:${userId}:${caseId}`

/**
 * Server-first reads for the cases pages. Per-user data, so `"use cache: private"`: the
 * entry stays in the browser, never in the shared server cache. `stale` must be at least
 * 30s for the entry to be prefetched with the page.
 */
export async function getExperiments(): Promise<ExperimentList> {
  "use cache: private"
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 })

  const { userId, accessToken } = await verifySession()
  cacheTag(experimentsTag(userId))
  return fetchExperiments(accessToken)
}

export async function getCases(
  params: CaseListParams & { experiment_id: string }
): Promise<CaseList> {
  "use cache: private"
  // The detection worker runs about once a minute.
  cacheLife({ stale: 30, revalidate: 60, expire: 3600 })

  const { userId, accessToken } = await verifySession()
  cacheTag(casesTag(userId))
  return fetchCases(accessToken, params)
}

export async function getCase(caseId: string): Promise<CaseDetail> {
  "use cache: private"
  cacheLife({ stale: 30, revalidate: 60, expire: 3600 })

  const { userId, accessToken } = await verifySession()
  cacheTag(caseTag(userId, caseId))
  return fetchCase(accessToken, caseId)
}

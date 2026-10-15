"use server"

import { updateTag } from "next/cache"

import { isExpectedApiError } from "@/lib/errors"
import { verifySession } from "@/lib/dal"

import { caseTag, casesTag } from "./queries"
import { AnnotationValuesSchema } from "./schemas"
import { postAnnotation } from "./server"

export type AnnotateCaseResult = { error?: string; ok?: boolean }

export async function annotateCaseAction(
  _previous: AnnotateCaseResult,
  formData: FormData
): Promise<AnnotateCaseResult> {
  // Server Actions are public endpoints: authenticate and validate every call.
  const session = await verifySession()

  const caseId = formData.get("caseId")
  if (typeof caseId !== "string" || !caseId) return { error: "Missing case" }

  const answers: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    // React adds `$ACTION_*` bookkeeping fields to the form data; they are not answers.
    if (key === "caseId" || key.startsWith("$")) continue
    if (typeof value === "string") answers[key] = value
  }
  const parsed = AnnotationValuesSchema.safeParse(answers)
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    return { error: "Every field needs an answer" }
  }

  try {
    await postAnnotation(session.accessToken, caseId, parsed.data)
  } catch (error) {
    // Expected failures are returned as values; everything else is rethrown to error.tsx.
    if (isExpectedApiError(error)) return { error: error.message }
    throw error
  }
  // The pages read through tagged private caches: expire the case and the lists.
  updateTag(caseTag(session.userId, caseId))
  updateTag(casesTag(session.userId))
  return { ok: true }
}

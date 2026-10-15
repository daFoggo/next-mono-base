"use server"

import { updateTag } from "next/cache"

import { isExpectedApiError } from "@/lib/errors"
import { verifySession } from "@/lib/dal"

import { profileTag } from "./queries"
import { UpdateProfileSchema } from "./schemas"
import { patchProfile } from "./server"

export type UpdateProfileState = { error?: string; saved?: boolean }

export async function updateProfileAction(
  _previous: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  // Server Actions are public endpoints: authenticate and validate every call.
  const session = await verifySession()

  const parsed = UpdateProfileSchema.safeParse({
    name: formData.get("name"),
    timezone: formData.get("timezone"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    await patchProfile(session.accessToken, parsed.data)
  } catch (error) {
    // Expected failures are returned as values. Everything else is rethrown: unexpected
    // errors reach error.tsx, and apiFetch's redirect on 401 must not be swallowed.
    if (isExpectedApiError(error)) return { error: error.message }
    throw error
  }

  updateTag(profileTag(session.userId))
  return { saved: true }
}

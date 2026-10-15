"use server"

import { updateTag } from "next/cache"

import { getErrorMessage } from "@/lib/errors"
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
    // Expected failures are returned as values; unexpected ones would reach error.tsx.
    return { error: getErrorMessage(error, "Unable to update profile") }
  }

  updateTag(profileTag(session.userId))
  return { saved: true }
}

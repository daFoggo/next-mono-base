import "server-only"

import { apiFetch } from "@/lib/http"

import {
  ProfileSchema,
  type Profile,
  type UpdateProfileInput,
} from "./schemas"

export async function fetchProfile(token: string): Promise<Profile> {
  return ProfileSchema.parse(await apiFetch<unknown>("users/me", { token }))
}

export async function patchProfile(
  token: string,
  input: UpdateProfileInput
): Promise<Profile> {
  return ProfileSchema.parse(
    await apiFetch<unknown>("users/me/profile", {
      token,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  )
}

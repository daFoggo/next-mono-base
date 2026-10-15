import { z } from "zod"

/** Shape of `UserInfo` returned by `GET users/me` and `PATCH users/me/profile`. */
export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullish(),
  timezone: z.string().default("UTC"),
})
export type Profile = z.infer<typeof ProfileSchema>

export const UpdateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  timezone: z.string().trim().min(1).max(64),
})
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

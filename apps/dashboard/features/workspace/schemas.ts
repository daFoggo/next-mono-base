import { z } from "zod"

export const PLANS = ["Free", "Pro", "Team"] as const
export const REGIONS = [
  "ap-southeast-1",
  "us-east-1",
  "us-west-2",
  "eu-west-1",
] as const

const Slug = z
  .string()
  .min(3)
  .max(48)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

const Name = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(48, "Name must be at most 48 characters")

/** DTOs: what the UI reads (`server.ts` parses every response into these). */
export const OrgSchema = z.object({
  slug: Slug,
  name: z.string(),
  plan: z.enum(PLANS),
  members: z.number().int(),
})
export const ProjectSchema = z.object({
  ref: Slug,
  name: z.string(),
  orgSlug: Slug,
  status: z.enum(["active", "paused"]),
  region: z.enum(REGIONS),
  createdAt: z.string(),
})
export type Org = z.infer<typeof OrgSchema>
export type Project = z.infer<typeof ProjectSchema>

/** Form input. The slug / ref is derived from the name on the server, never trusted from the client. */
export const CreateOrgSchema = z.object({ name: Name })
export const CreateProjectSchema = z.object({
  name: Name,
  region: z.enum(REGIONS, "Pick a region"),
})
export type CreateOrgInput = z.infer<typeof CreateOrgSchema>
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>

/** Per-owner / per-org caps: nothing else stops one account from filling the table. */
export const MAX_ORGS_PER_OWNER = 20
export const MAX_PROJECTS_PER_ORG = 50

/**
 * Slugs are global keys, so a taken name must not block another tenant's: retry with a short
 * suffix instead of failing. Attempt 0 is the plain slug; the base is trimmed so the result stays valid.
 */
export const SLUG_ATTEMPTS = 4
export function slugCandidate(slug: string, attempt: number): string {
  if (attempt === 0) return slug
  const suffix = Math.random().toString(36).slice(2, 6).padEnd(4, "0")
  return `${slug.slice(0, 43).replace(/-+$/, "")}-${suffix}`
}

/** "Internal tools!" becomes "internal-tools". */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

import "server-only"

import { ApiError } from "@/lib/errors"

import {
  MAX_ORGS_PER_OWNER,
  MAX_PROJECTS_PER_ORG,
  OrgSchema,
  ProjectSchema,
  SLUG_ATTEMPTS,
  slugCandidate,
  slugify,
  type CreateOrgInput,
  type CreateProjectInput,
  type Org,
  type Project,
} from "./schemas"

/**
 * The only place that talks to the backend. It is a MOCK: an in-memory store seeded with demo
 * data, so every query and action above it is real. To go live, replace the bodies with
 * `apiFetch` (FastAPI) or `createDataClient` + `unwrap` (Supabase); keep the signatures, the Zod
 * parsing and the errors (`ApiError` 4xx = expected, returned to the form as a message).
 * `viewerId` is the signed-in user id, used to enforce tenant isolation.
 */
type DbOrg = Org & { ownerId?: string }
type Db = { orgs: DbOrg[]; projects: Project[] }

const SEED: Db = {
  orgs: [
    { slug: "acme", name: "Acme Inc", plan: "Pro", members: 8, ownerId: "*" },
    { slug: "globex", name: "Globex", plan: "Free", members: 3, ownerId: "*" },
    {
      slug: "initech",
      name: "Initech",
      plan: "Team",
      members: 14,
      ownerId: "*",
    },
  ],
  projects: [
    {
      ref: "web-app",
      name: "Web app",
      orgSlug: "acme",
      status: "active",
      region: "ap-southeast-1",
      createdAt: "2026-01-12",
    },
    {
      ref: "api",
      name: "API",
      orgSlug: "acme",
      status: "active",
      region: "ap-southeast-1",
      createdAt: "2026-02-03",
    },
    {
      ref: "analytics",
      name: "Analytics",
      orgSlug: "acme",
      status: "paused",
      region: "us-east-1",
      createdAt: "2026-04-21",
    },
    {
      ref: "mobile",
      name: "Mobile",
      orgSlug: "globex",
      status: "active",
      region: "eu-west-1",
      createdAt: "2026-03-08",
    },
    {
      ref: "landing",
      name: "Landing",
      orgSlug: "globex",
      status: "paused",
      region: "eu-west-1",
      createdAt: "2026-05-30",
    },
    {
      ref: "billing",
      name: "Billing",
      orgSlug: "initech",
      status: "active",
      region: "us-east-1",
      createdAt: "2025-11-17",
    },
    {
      ref: "internal-tools",
      name: "Internal tools",
      orgSlug: "initech",
      status: "active",
      region: "us-east-1",
      createdAt: "2025-12-02",
    },
    {
      ref: "data-warehouse",
      name: "Data warehouse",
      orgSlug: "initech",
      status: "active",
      region: "us-west-2",
      createdAt: "2026-06-14",
    },
  ],
}

/** The store lives in process memory and the demo login is public: bound its total size. */
const MAX_MOCK_ROWS = 500
const SEED_ORG_SLUGS = new Set(SEED.orgs.map((org) => org.slug))
const SEED_PROJECT_REFS = new Set(SEED.projects.map((project) => project.ref))

/** Full store: drop the oldest visitor-created org (with its projects) instead of refusing everyone. */
function makeRoomForOrg() {
  const index = db.orgs.findIndex((org) => !SEED_ORG_SLUGS.has(org.slug))
  if (index < 0)
    throw new ApiError(429, "Demo storage is full, try again later")
  const [gone] = db.orgs.splice(index, 1)
  db.projects = db.projects.filter((p) => p.orgSlug !== gone?.slug)
}

function makeRoomForProject() {
  const index = db.projects.findIndex((p) => !SEED_PROJECT_REFS.has(p.ref))
  if (index < 0)
    throw new ApiError(429, "Demo storage is full, try again later")
  db.projects.splice(index, 1)
}

function freeSlug(base: string, taken: (slug: string) => boolean): string {
  for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
    const slug = slugCandidate(base, attempt)
    if (!taken(slug)) return slug
  }
  throw new ApiError(409, "Could not pick a free name, please try again")
}

// On globalThis so dev hot reloads keep what was created.
const globalForDb = globalThis as { __workspaceMock?: Db }
const db = (globalForDb.__workspaceMock ??= structuredClone(SEED))

export async function fetchOrgs(viewerId: string): Promise<Org[]> {
  const visible = db.orgs.filter(
    (org) => !org.ownerId || org.ownerId === "*" || org.ownerId === viewerId
  )
  return OrgSchema.array().parse(visible)
}

export async function fetchProjects(viewerId: string): Promise<Project[]> {
  const visibleOrgSlugs = new Set(
    db.orgs
      .filter(
        (org) => !org.ownerId || org.ownerId === "*" || org.ownerId === viewerId
      )
      .map((org) => org.slug)
  )
  const visible = db.projects.filter((p) => visibleOrgSlugs.has(p.orgSlug))
  return ProjectSchema.array().parse(visible)
}

export async function insertOrg(
  viewerId: string,
  input: CreateOrgInput
): Promise<Org> {
  const base = slugify(input.name)
  if (base.length < 3)
    throw new ApiError(422, "Use letters or numbers in the name")
  if (db.orgs.length >= MAX_MOCK_ROWS) makeRoomForOrg()
  const owned = db.orgs.filter((org) => org.ownerId === viewerId).length
  if (owned >= MAX_ORGS_PER_OWNER) {
    throw new ApiError(
      429,
      `You can own at most ${MAX_ORGS_PER_OWNER} organizations`
    )
  }
  const slug = freeSlug(base, (s) => db.orgs.some((org) => org.slug === s))
  const org = OrgSchema.parse({
    slug,
    name: input.name,
    plan: "Free",
    members: 1,
  })
  db.orgs.push({ ...org, ownerId: viewerId })
  return org
}

export async function insertProject(
  viewerId: string,
  orgSlug: string,
  input: CreateProjectInput
): Promise<Project> {
  const targetOrg = db.orgs.find((org) => org.slug === orgSlug)
  if (!targetOrg) {
    throw new ApiError(404, "Organization not found")
  }

  // Enforce tenant boundary: caller must have access to the target organization
  const isAuthorized =
    !targetOrg.ownerId ||
    targetOrg.ownerId === "*" ||
    targetOrg.ownerId === viewerId
  if (!isAuthorized) {
    throw new ApiError(
      403,
      "You do not have permission to create projects in this organization"
    )
  }

  const base = slugify(input.name)
  if (base.length < 3)
    throw new ApiError(422, "Use letters or numbers in the name")
  if (db.projects.length >= MAX_MOCK_ROWS) makeRoomForProject()
  const existing = db.projects.filter((p) => p.orgSlug === orgSlug).length
  if (existing >= MAX_PROJECTS_PER_ORG) {
    throw new ApiError(
      429,
      `An organization can hold at most ${MAX_PROJECTS_PER_ORG} projects`
    )
  }
  const ref = freeSlug(base, (r) => db.projects.some((p) => p.ref === r))
  const project = ProjectSchema.parse({
    ref,
    name: input.name,
    orgSlug,
    status: "active",
    region: input.region,
    createdAt: new Date().toISOString().slice(0, 10),
  })
  db.projects.push(project)
  return project
}

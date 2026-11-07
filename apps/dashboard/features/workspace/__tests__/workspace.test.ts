import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

import { ApiError } from "@/lib/errors"

import {
  CreateProjectSchema,
  MAX_ORGS_PER_OWNER,
  slugCandidate,
  slugify,
} from "../schemas"
import {
  fetchOrgs,
  fetchProjects,
  insertOrg,
  insertProject,
} from "../server.mock"

describe("slugify", () => {
  it("lowercases, strips accents and joins with dashes", () => {
    expect(slugify("Internal tools!")).toBe("internal-tools")
    expect(slugify("  Công ty Việt  ")).toBe("cong-ty-viet")
  })
})

describe("slugCandidate", () => {
  it("keeps long names valid after the suffix", () => {
    const long = slugify("a".repeat(30) + " " + "b".repeat(17))
    expect(long.length).toBe(48)
    const next = slugCandidate(long, 1)
    expect(next).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    expect(next.length).toBeLessThanOrEqual(48)
  })
})

describe("CreateProjectSchema", () => {
  it("rejects short names and unknown regions", () => {
    expect(
      CreateProjectSchema.safeParse({ name: "ab", region: "us-east-1" }).success
    ).toBe(false)
    expect(
      CreateProjectSchema.safeParse({ name: "Web", region: "mars-1" }).success
    ).toBe(false)
    expect(
      CreateProjectSchema.safeParse({ name: "Web", region: "us-east-1" })
        .success
    ).toBe(true)
  })
})

describe("mock backend", () => {
  it("returns Zod-parsed seed data", async () => {
    expect((await fetchOrgs("t")).map((o) => o.slug)).toContain("acme")
    expect((await fetchProjects("t")).length).toBeGreaterThan(0)
  })

  it("creates an organization and gives a duplicate name a suffixed slug", async () => {
    const org = await insertOrg("t", { name: "Umbrella Corp" })
    expect(org).toMatchObject({
      slug: "umbrella-corp",
      plan: "Free",
      members: 1,
    })
    const again = await insertOrg("other", { name: "Umbrella Corp" })
    expect(again.slug).toMatch(/^umbrella-corp-[a-z0-9]{4}$/)
  })

  it("caps organizations per owner with an expected 429", async () => {
    for (let i = 0; i < MAX_ORGS_PER_OWNER; i++) {
      await insertOrg("capped", { name: `Capped org ${i}` })
    }
    const error = await insertOrg("capped", { name: "One too many" }).catch(
      (e: unknown) => e
    )
    expect(error).toMatchObject({ status: 429 })
  })

  it("evicts the oldest visitor org when the store is full, and never the seed", async () => {
    // 26 owners x 20 orgs is more than the 500-row bound.
    for (let owner = 0; owner < 26; owner++) {
      for (let i = 0; i < MAX_ORGS_PER_OWNER; i++) {
        await insertOrg(`fill-${owner}`, { name: `Fill ${owner} org ${i}` })
      }
    }
    const slugs = (await fetchOrgs("fill-25")).map((o) => o.slug)
    expect(slugs).toContain("acme")
    expect(slugs).toContain("fill-25-org-19")
    expect(await fetchOrgs("fill-0")).not.toContainEqual(
      expect.objectContaining({ name: "Fill 0 org 0" })
    )
  })

  it("creates a project in an existing organization only", async () => {
    const project = await insertProject("t", "acme", {
      name: "Docs site",
      region: "eu-west-1",
    })
    expect(project).toMatchObject({
      ref: "docs-site",
      orgSlug: "acme",
      status: "active",
    })
    const error = await insertProject("t", "ghost", {
      name: "Nope",
      region: "eu-west-1",
    }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(404)
  })

  it("enforces tenant isolation between caller tokens", async () => {
    // User A creates their own organization
    const orgA = await insertOrg("token-user-a", { name: "Tenant A Org" })
    expect(orgA.slug).toBe("tenant-a-org")

    // User A can see Tenant A Org
    const orgsA = await fetchOrgs("token-user-a")
    expect(orgsA.some((o) => o.slug === "tenant-a-org")).toBe(true)

    // User B cannot see Tenant A Org
    const orgsB = await fetchOrgs("token-user-b")
    expect(orgsB.some((o) => o.slug === "tenant-a-org")).toBe(false)

    // User B cannot insert projects into Tenant A Org (403 Forbidden)
    const error = await insertProject("token-user-b", "tenant-a-org", {
      name: "Tenant B Hijack",
      region: "us-east-1",
    }).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(403)

    // User A can successfully insert project into their own org
    const projectA = await insertProject("token-user-a", "tenant-a-org", {
      name: "Project A Valid",
      region: "us-east-1",
    })
    expect(projectA.ref).toBe("project-a-valid")
  })
})

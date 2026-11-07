import "server-only"

import { env } from "@/lib/env"

import * as mock from "./server.mock"
import * as neon from "./server.neon"

/**
 * The only place that talks to the backend; the data path follows `AUTH_PROVIDER` (docs/providers.md):
 * `neon-auth` = Neon Postgres, everything else = the bounded in-memory store.
 * Both implementations share signatures and DTOs (`server.neon.ts` is type-checked against the mock).
 */
const impl = env.AUTH_PROVIDER === "neon-auth" ? neon : mock

// shortcut: supabase / keycloak / fastapi-oauth have no data path yet, so their workspaces vanish on restart; add one per provider.
if (!["neon-auth", "demo"].includes(env.AUTH_PROVIDER)) {
  console.warn(
    `[workspace] AUTH_PROVIDER=${env.AUTH_PROVIDER} has no data path: using the in-memory store, data is lost on restart.`
  )
}

export const fetchOrgs = impl.fetchOrgs
export const fetchProjects = impl.fetchProjects
export const insertOrg = impl.insertOrg
export const insertProject = impl.insertProject

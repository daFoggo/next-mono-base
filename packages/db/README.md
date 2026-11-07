# @workspace/db

Data layer shared by the apps. Two independent halves; `AUTH_PROVIDER` decides which one a deployment uses
(`neon-auth` → Neon, `supabase` → Supabase; see `docs/providers.md`).

| Half | Exports | Used by |
| :--- | :--- | :--- |
| Neon Postgres (Drizzle) | `@workspace/db/neon` (`getDb()`), `@workspace/db/neon/schema` (`orgs`, `projects`) | `apps/dashboard/features/workspace/server.neon.ts` |
| Supabase foundation | `/env`, `/server` (`createDataClient`, `unwrap`), `/public` (`createPublicClient`), `/types`, `/errors` | `@workspace/auth` (`/env`), `apps/dashboard` (`/errors`); `/server`, `/public` are kept for a project that starts on Supabase |

## Neon (`neon/`, `src/neon/`)

| Script (`pnpm --filter @workspace/db …`) | What it does |
| :--- | :--- |
| `neon:generate` | New migration from `src/neon/schema.ts` into `neon/migrations` (never edit an applied one) |
| `neon:migrate` | Applies migrations over the direct `DATABASE_URL_UNPOOLED` read from `apps/dashboard/.env.local` |

`neon:migrate` runs against whatever database that file points at: check `DATABASE_URL_UNPOOLED` first, and try schema
changes on a Neon branch before production. Fill the file with `pnpm neon:env` (root). The pooled `DATABASE_URL` is for the
app; `getDb()` creates its pool on first use, so importing the package needs no database.

## Supabase (`supabase/`)

| Script (`pnpm --filter @workspace/db …`) | What it does |
| :--- | :--- |
| `exec supabase migration new <name>` | New migration in `supabase/migrations` (never hand-name the file) |
| `db:test -- --dry` | Runs every pgTAP file with all migrations prepended, inside one transaction that rolls back: try unpushed migrations without touching the database |
| `db:push` | Applies new migrations to the linked project |
| `db:test` | Runs the pgTAP files against the linked project (each rolls back) |
| `db:types` | Regenerates `src/database.types.ts`; run after every pushed migration |
| `exec supabase db advisors --linked` | Security and performance lints |

`supabase test db --linked` needs Docker for `pg_prove`; `scripts/test-db.mjs` runs the same files through
`supabase db query` instead. Each test file is `begin; … rollback;`, collects TAP lines in a temp table `tap_out`
and ends by selecting them as one `tap` column, because the Management API returns only the last result set.

Migrations: `20261026000001_foundation.sql` holds what `@workspace/auth` needs (role helpers read from `app_metadata`,
`profiles` with RLS, the admin-only `set_staff_role` / `list_accounts` RPCs); `20261107000001_harden_admin_rpcs.sql`
closes the RPCs to non-admins, revokes sessions on demotion and removes the default `PUBLIC` execute grant. Add your own
tables in new migrations. `signing_keys.json` is local-only and git-ignored.

# next-mono-base

Next.js 16.4 + Turborepo + pnpm monorepo base with shadcn/ui (`base-nova` + Animate UI) and pluggable authentication (`neon-auth` | `supabase` | `keycloak` | `fastapi-oauth` | `demo`).

The conventions live in [docs/](docs/): read the one for the area you change before changing it (index in [AGENTS.md](AGENTS.md)).

## Structure

```
apps/
  web/                    Next.js landing page (runnable, public)
  dashboard/              Next.js dashboard: sign-in and the app shell (runnable)
packages/
  ui/                     @workspace/ui — shared shadcn/ui components, styles
  auth/                   @workspace/auth — Neon Auth / Supabase / Keycloak / FastAPI OAuth2 providers behind AUTH_PROVIDER
  ui-patterns/            @workspace/ui-patterns — pieces both apps share: ThemeProvider, ThemeToggle, AppLogo, StackGrid
  db/                     @workspace/db — Supabase & PostgreSQL clients, types, migrations
  eslint-config/          @workspace/eslint-config
  typescript-config/      @workspace/typescript-config
```

`apps/` holds things that run; `packages/` holds everything shared. Packages are
scoped `@workspace/*`, declared with `workspace:*`, and never nested or imported via `../`.

## Commands

```bash
pnpm install
pnpm dev                          # all apps: web (landing) on :3000, dashboard on :3001
pnpm turbo run dev --filter=dashboard   # one app
pnpm build
pnpm check                        # lint + typecheck + test
```

Pick the sign-in stack in `apps/dashboard/.env.local` (template: `apps/dashboard/.env.example`,
details: [docs/providers.md](docs/providers.md)). `AUTH_PROVIDER=demo` needs no database. Build and run with the
same `AUTH_PROVIDER`.

<!-- demo:start -->
## Start from an empty base

The dashboard ships with sample organizations and projects that show the patterns (scoped menus, breadcrumb,
a data slice, a detail sheet). To start your own app without them:

```bash
pnpm clean:start --dry-run        # print the plan, change nothing
pnpm clean:start                  # needs a clean git tree: commit or stash first
pnpm check && pnpm build
```

It deletes the sample features, replaces the shared files they touched with their clean versions, drops the
sample tables with a new migration and removes itself. The docs stay: a new feature follows
[docs/adding-a-feature.md](docs/adding-a-feature.md). To undo before committing, run `git restore .` and delete
the untracked files that `git status` lists.

Changing a file the script touches (the paths in `scripts/clean/overlay/` and every file with a demo block marker)?
Run `pnpm verify:clean`: it cleans a copy of the repo and runs install, check and build on it. CI does the same.
<!-- demo:end -->

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add button -c apps/dashboard
```

Components land in `packages/ui/src/components`; import with
`import { Button } from "@workspace/ui/components/button"`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions.

# next-mono-base

Next.js 16 + Turborepo + pnpm monorepo base with shadcn/ui.

## Structure

```
apps/
  web/                    Next.js web app (runnable)
  admin/                  Next.js staff app (runnable)
packages/
  ui/                     @workspace/ui — shared shadcn/ui components, styles
  auth/                   @workspace/auth — Better Auth / Supabase providers behind AUTH_PROVIDER
  db/                     @workspace/db — Supabase clients, types, migrations
  eslint-config/          @workspace/eslint-config
  typescript-config/      @workspace/typescript-config
```

`apps/` holds things that run; `packages/` holds everything shared. Packages are
scoped `@workspace/*`, declared with `workspace:*`, and never nested or imported via `../`.

## Commands

```bash
pnpm install
pnpm dev                          # all apps: web on :3000, admin on :3001
pnpm turbo run dev --filter=web   # one app
pnpm build
pnpm check                        # lint + typecheck
```

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components land in `packages/ui/src/components`; import with
`import { Button } from "@workspace/ui/components/button"`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions.

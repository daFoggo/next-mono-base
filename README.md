# next-mono-base

Next.js 16 + Turborepo + pnpm monorepo base with shadcn/ui.

## Structure

```
apps/
  web/                    Next.js app (runnable)
packages/
  ui/                     @workspace/ui — shared shadcn/ui components, styles
  eslint-config/          @workspace/eslint-config
  typescript-config/      @workspace/typescript-config
```

`apps/` holds things that run; `packages/` holds everything shared. Packages are
scoped `@workspace/*`, declared with `workspace:*`, and never nested or imported via `../`.

## Commands

```bash
pnpm install
pnpm dev                          # all apps
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

---
name: next-mono-base
description: >
  Essential architecture conventions, data fetching, caching ('use cache'), mutations,
  and DAL rules for next-mono-base (Next.js 16.4 + Turborepo). Use whenever creating or modifying
  routes, pages, components, queries, server actions, or auth in this repository.
---

# next-mono-base Conventions & Decision Router

Fast decision guide for `apps/web` running on **Next.js 16.4.0** with `cacheComponents: true` and `partialPrefetching: true`.
All principles derive from and link back to the Single Source of Truth in `docs/`.

---

## 1. Decision Router (What are you building?)

| Task / Intent | Solution Pattern | Quick Ref | Source of Truth (Docs) |
| :--- | :--- | :--- | :--- |
| **Add a feature / page / route** | Feature slice in `features/<name>` + compose in `app/` | [project-structure.md](references/project-structure.md) | [project-structure.md](../../../docs/project-structure.md) |
| **Read data for a page** | Server Component $\rightarrow$ `queries.ts` $\rightarrow$ `server.ts` | [reads.md](references/reads.md) | [data-fetching.md §4](../../../docs/data-fetching.md#4-reading-on-the-server) |
| **Pass data to Client Component** | Pass un-awaited Promise $\rightarrow$ React 19 `use(promise)` | [reads.md](references/reads.md) | [data-fetching.md §7.1](../../../docs/data-fetching.md#71-promise--use) |
| **Cache shared data** | `"use cache"` + `cacheLife("hours")` + `cacheTag()` | [caching.md](references/caching.md) | [data-fetching.md §5.1](../../../docs/data-fetching.md#51-use-cache) |
| **Cache per-user data** | `"use cache: private"` + `cacheLife()` (browser-only) | [caching.md](references/caching.md) | [data-fetching.md §5.2](../../../docs/data-fetching.md#52-per-user-data) |
| **Write / Update / Delete** | Server Action in `actions.ts` + `updateTag()` | [mutations.md](references/mutations.md) | [data-fetching.md §8](../../../docs/data-fetching.md#8-mutations) |
| **Filters, search, pagination** | URL searchParams + `<Form>` / `<Link>` (no client state) | [interactive.md](references/interactive.md) | [data-fetching.md §7.2](../../../docs/data-fetching.md#72-interactive-lists-and-forms-without-a-client-data-library) |
| **Authenticate / verify session** | `verifySession()` from `@/lib/dal` (inside queries/actions) | [auth-dal.md](references/auth-dal.md) | [authentication.md §2](../../../docs/authentication.md#2-architecture) |
| **Extract code to `packages/`** | Keep in `apps/web` unless 2+ apps or diff runtime | [project-structure.md](references/project-structure.md) | [project-structure.md §6](../../../docs/project-structure.md#6-monorepo-package-extraction-when-to-extract-to-packages) |
| **Random, time, sync DB** | `await io()` from `next/cache` inside `<Suspense>` | [reads.md](references/reads.md) | [data-fetching.md §1](../../../docs/data-fetching.md#1-mental-model) |
| **Redis cache / SSE / Uploads** | Distributed CacheHandler, Presigned URLs, `connection()` | [reads.md](references/reads.md) | [advanced-patterns.md](../../../docs/advanced-patterns.md) |

---

## 2. Five Golden Rules (Non-Negotiable)

1. **Server-First by Default**: No client data libraries (TanStack Query, SWR). Reads in Server Components, writes in Server Actions ([docs §3](../../../docs/data-fetching.md#3-choosing-how-to-read-data)).
2. **Never `await` at Top-Level of Page/Layout**: Push `await cookies()`, `headers()`, `params`, `searchParams` into child components wrapped in `<Suspense>` ([docs §4.4](../../../docs/data-fetching.md#44-request-time-data)).
3. **Always Call `cacheLife()` with `"use cache"`**: Cache keys use plain IDs only (never tokens, emails, or secrets) ([docs §5.1](../../../docs/data-fetching.md#51-use-cache)).
4. **Prefer `io()` over `connection()`**: `io()` allows prefetching and works inside `"use cache: private"`; `connection()` blocks prefetches ([docs §1](../../../docs/data-fetching.md#1-mental-model)).
5. **Strict Architectural Boundaries**: `features/<name>` never imports `app/` or sibling features. Only `server.ts` and `lib/dal.ts` perform backend I/O ([docs](../../../docs/project-structure.md#4-dependency-direction--eslint-boundary-enforcement)).

---

## 3. Source of Truth Documentation Index

When facing complex edge cases, always consult the full architecture docs:
- [docs/project-structure.md](../../../docs/project-structure.md) — Feature-based architecture, ESLint boundaries, and monorepo package extraction.
- [docs/data-fetching.md](../../../docs/data-fetching.md) — Core reading, caching, streaming, and mutation model.
- [docs/authentication.md](../../../docs/authentication.md) — Session lifecycle, token refresh in proxy, Supabase & backend providers.
- [docs/advanced-patterns.md](../../../docs/advanced-patterns.md) — Distributed Redis cache, large uploads, SSE, OpenTelemetry & Playwright instant tests.

# Data fetching & mutation

Sources: Next.js 16.4 docs (fetching data, caching, `use cache`, data security,
authentication, revalidating, proxy) and TanStack Query "Advanced SSR".

## Default model: RSC-first

| Need | Use |
|---|---|
| Read data for a page | Server Component calls `features/<x>/queries.ts` (→ `server.ts` → `lib/http.ts`) |
| Reuse a read within one request | `React.cache` (DAL does this for the session) |
| Cache across requests | `"use cache"` + `cacheLife` (+ `cacheTag`) on the data function |
| Request-dependent UI (cookies, headers, `params`, `searchParams`) | Read it in a component wrapped in `<Suspense>` |
| Mutation | Server Action in `actions.ts`, then `updateTag` (read-your-writes) or `revalidateTag(tag, "max")` |
| Streamed data to a client component | Pass the un-awaited promise as a prop and read it with `use()` inside `<Suspense>` |
| Rich client-side fetching (polling, infinite scroll, optimistic UI) | TanStack Query (see below) |

## Rules from the docs that shape our code

- **Data Access Layer** (Next's recommendation for new projects): server-only, does authorization,
  returns minimal DTOs. Only the DAL / `lib/env.ts` read `process.env` secrets. Pick one approach; do not mix.
- **Check auth next to the data**, not in layouts (layouts do not re-render on navigation).
  `proxy.ts` is only an optimistic redirect.
- **`"use cache"` cannot read `cookies()`/`headers()`/`searchParams`**, directly or via a helper.
  Read them outside and pass values (e.g. `userId`) as arguments. Arguments and results must be serializable.
  `React.cache` values do not cross into a `use cache` scope.
- **Server Actions are public endpoints**: each one calls `verifySession()` and validates input with Zod.
- `NEXT_PUBLIC_*` values are inlined at build time; reference them literally.

## Adding TanStack Query later (client fetching)

Not installed yet. When added (per TanStack Advanced SSR guide):

1. `getQueryClient()`: new client per request on the server, singleton in the browser; `staleTime` > 0;
   dehydrate pending queries so prefetches can stream.
2. A `"use client"` `Providers` component wrapping `children` in `app/layout.tsx`.
3. Prefetch in a Server Component **without awaiting**, wrap the client component in `HydrationBoundary`,
   and read with `useSuspenseQuery`.
4. Do **not** use Server Actions as `queryFn` (they run serially from the client); use Route Handlers.
   Server Actions stay for mutations.
5. Do not render the same data from a Server Component and a query; Server Components cannot be
   revalidated by the query cache and would drift. Treat the server as a prefetch location only.
6. Query hooks live in `features/<x>/` client files (e.g. `use-<x>.ts`) and never import `server.ts`.

## Auth providers (one per deployment)

`AUTH_PROVIDER=backend|supabase` (see `apps/web/.env.example`). Both implement `lib/auth/types.ts`
and produce the same `Session { userId, accessToken }`, so `lib/http.ts` always sends the Bearer token
(Supabase login + custom backend works if the backend validates Supabase JWTs).

- Tokens are refreshed only in `proxy.ts`; Server Components cannot write cookies and refreshing in two
  places can revoke single-use refresh tokens.
- Never authorize from cookie contents alone: backend mode resolves the user via `users/me`, Supabase mode
  uses `getClaims()`. This also keeps `userId` safe to use as a `"use cache"` argument.
- Misconfigured provider env fails every request with a 500 (zod error) instead of silently degrading.

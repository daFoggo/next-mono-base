# Reading Data (Server-First & DAL)

## 1. When to Use
Use when implementing data fetching for a page, layout, or passing server data into Client Components.

## 2. Decision Matrix

| Requirement | Implementation Pattern |
| :--- | :--- |
| **Independent reads** | Sibling Server Components behind separate `<Suspense>`, or `Promise.all([getA(), getB()])`. |
| **Sequential reads** | Render dependent read in a child component behind its own `<Suspense>`. |
| **Client Component needs data** | Pass the **un-awaited promise** as a prop, read via `use(promise)`. |
| **Sync runtime values (`Date.now()`, random)** | Call `await io()` (from `next/cache`) inside `<Suspense>`. |

## 3. Canonical Pattern

```tsx
// features/cases/server.ts
import "server-only"
export async function fetchCases(token: string) {
  return CasesSchema.parse(await apiFetch("cases", { token }))
}

// app/cases/page.tsx
export default function Page({ params }: PageProps<"/cases/[id]">) {
  return (
    <>
      <h1>Cases</h1> {/* In static shell */}
      <Suspense fallback={<CasesSkeleton />}>
        {params.then(({ id }) => <CaseList id={id} />)}
      </Suspense>
    </>
  )
}
```

## 4. Never Do
- ❌ **Never `await` at the top of a page/layout**: It blocks the entire static shell.
- ❌ **Never call this app's own Route Handlers (`/api/...`) from Server Components**: It creates redundant network round-trips.
- ❌ **Never swallow errors into `null` or `[]`**: Let unexpected errors throw to `error.tsx`.

## 5. Source of Truth (Deep Dive)
- Full architectural design & benchmark analysis: [docs/data-fetching.md §4](../../../../docs/data-fetching.md#4-reading-on-the-server)
- Promise + `use()` pattern: [docs/data-fetching.md §7.1](../../../../docs/data-fetching.md#71-promise--use)

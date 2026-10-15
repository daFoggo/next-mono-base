# Authentication & Data Access Layer (DAL)

## 1. When to Use
Use when checking user sessions, protecting endpoints, or making authorized backend calls.

## 2. Architecture & Call Paths
- **`proxy.ts`**: Optimistic check & token refresh only. Writes refreshed cookies to request and response.
- **`lib/dal.ts`**: System-of-record authorization. Exports `getSession()`, `verifySession()`, `verifySessionFresh()`.
- **`lib/http.ts`**: Injects Bearer token from session; throws `ApiError` on non-2xx. A 401 ends the session.

## 3. Canonical Pattern

```ts
// In queries or actions:
import { verifySession } from "@/lib/dal"

export async function getUserItems() {
  const session = await verifySession() // Redirects to /auth/expired if unauthenticated
  return fetchItems(session.accessToken)
}
```

In `backendProvider.getSession()`: Call `await io()` before reading `cookies()` so that `Date.now()` is not frozen into the static build shell.

## 4. Never Do
- ❌ **Never authorize in `layout.tsx`**: Layouts do not re-render on sub-navigation. Always authorize close to the data in `queries.ts` or `actions.ts`.
- ❌ **Never attempt to write cookies in Server Components**: Cookies can only be mutated in `proxy.ts`, Server Actions, or Route Handlers.

## 5. Source of Truth (Deep Dive)
- Complete provider design (`backend` vs `supabase`): [docs/authentication.md §1-5](../../../../docs/authentication.md#1-overview)
- Proxy token refresh flow: [docs/authentication.md §4](../../../../docs/authentication.md#4-provider-backend)

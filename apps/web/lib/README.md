# lib/

App infrastructure, not tied to one feature. Server-only modules start with `import "server-only"`.

- `env.ts` / `env.public.ts`: validated env (server-only / browser-safe).
- `http.ts`: backend `fetch` wrapper (only feature `server.ts` files import it).
- `errors.ts`: `ApiError`, `getErrorMessage`.
- `dal.ts`: Data Access Layer: `getSession`, `verifySession` (React `cache`). Call next to the data.
- `auth/`: provider adapters. **One provider per deployment** via `AUTH_PROVIDER=backend|supabase`.
  - `types.ts` contract, `config.ts` validated auth env (no `server-only`, the proxy uses it).
  - `backend/`: tokens in one httpOnly cookie; identity resolved via `GET users/me`.
  - `supabase/`: `@supabase/ssr`; identity via `getClaims()`.
  - `proxy.ts` is the **only** place that refreshes tokens (called from `/proxy.ts`).

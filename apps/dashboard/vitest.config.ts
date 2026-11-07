import { fileURLToPath } from "node:url"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    exclude: [...configDefaults.exclude, "e2e/**"],
    env: {
      AUTH_PROVIDER: "neon-auth",
      // neon-auth needs one at runtime; no test connects (the live one is skipped without NEON_TEST_DATABASE_URL).
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      API_BASE_URL: "http://localhost:8099/api/v1/",
    },
  },
})

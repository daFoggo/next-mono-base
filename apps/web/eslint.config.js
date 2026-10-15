import { nextJsConfig } from "@workspace/eslint-config/next-js"

const featureRestrictions = [
  { group: ["@/app", "@/app/**"], message: "features/ must not import from app/." },
  {
    group: ["@/features", "@/features/**"],
    message:
      "Features must not import other features. Compose them in app/, and use relative imports inside a feature.",
  },
]

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: featureRestrictions }],
    },
  },
  {
    // Declared after the block above so this rule set replaces it for components/.
    files: ["features/*/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...featureRestrictions,
            {
              group: ["**/server", "**/queries", "@/lib/dal", "@/lib/http"],
              message:
                "Feature components must not import server-only modules (server, queries, dal, http).",
            },
          ],
        },
      ],
    },
  },
]

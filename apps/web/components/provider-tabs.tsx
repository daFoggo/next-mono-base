"use client"

import { useState } from "react"
import { IconCheck, IconCopy, IconTerminal2 } from "@tabler/icons-react"

type ProviderKey = "keycloak" | "better-auth" | "supabase"

interface ProviderInfo {
  name: string
  badge: string
  envSnippet: string
  features: string[]
}

const PROVIDERS: Record<ProviderKey, ProviderInfo> = {
  keycloak: {
    name: "Keycloak 26",
    badge: "Enterprise OIDC",
    envSnippet: `AUTH_PROVIDER="keycloak"
KEYCLOAK_ISSUER="http://localhost:8080/realms/studio"
KEYCLOAK_CLIENT_ID="studio-app"
KEYCLOAK_CLIENT_SECRET="studio-dev-client-secret"`,
    features: [
      "PKCE S256 with split cookies under 4KB",
      "Offline RS256 JWT verification via public JWKS",
      "Single sign-on & standalone Docker stack",
    ],
  },
  "better-auth": {
    name: "Better Auth",
    badge: "TypeScript Native",
    envSnippet: `AUTH_PROVIDER="better-auth"
BETTER_AUTH_SECRET="your-32-character-random-secret"
BETTER_AUTH_URL="http://localhost:3001"`,
    features: [
      "Lightweight TypeScript authentication framework",
      "Direct PostgreSQL connection via @workspace/db",
      "Session management with cookie fallback",
    ],
  },
  supabase: {
    name: "Supabase",
    badge: "Postgres BaaS",
    envSnippet: `AUTH_PROVIDER="supabase"
NEXT_PUBLIC_SUPABASE_URL="https://your-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"`,
    features: [
      "Supabase Auth & GoTrue SSR cookies integration",
      "Row Level Security (RLS) policies enforcement",
      "PostgreSQL, Storage, and Realtime channels",
    ],
  },
}

export function ProviderTabs() {
  const [active, setActive] = useState<ProviderKey>("keycloak")
  const [copied, setCopied] = useState(false)

  const current = PROVIDERS[active]

  const handleCopy = () => {
    navigator.clipboard.writeText(current.envSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border/50 bg-muted/10">
      {/* Header with provider tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-border/40 bg-muted/20 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1.5">
          <IconTerminal2 className="size-4 text-muted-foreground" />
          <span className="font-mono text-xs text-muted-foreground">
            .env.local switch
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border/40 bg-background/80 p-0.5">
          {(Object.keys(PROVIDERS) as ProviderKey[]).map((key) => {
            const isSelected = active === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                  isSelected
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {PROVIDERS[key].name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Code snippet display */}
      <div className="relative p-4 font-mono text-xs">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy snippet"
          className="absolute top-3 right-3 flex items-center gap-1 rounded border border-border/40 bg-background/60 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? (
            <>
              <IconCheck className="size-3 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <IconCopy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>

        <pre className="overflow-x-auto text-foreground/90 leading-relaxed font-mono">
          <code>{current.envSnippet}</code>
        </pre>
      </div>

      {/* Unified DAL Query (Always identical across all providers!) */}
      <div className="border-t border-border/40 bg-muted/25 px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border/60 bg-background px-2 py-0.5 font-mono text-[11px] text-foreground/80">
              Unified DAL
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              Application code stays identical:
            </span>
          </div>
          <code className="font-mono text-xs text-foreground/90 bg-background/80 px-2 py-0.5 rounded border border-border/40">
            const session = await getSession()
          </code>
        </div>
      </div>
    </div>
  )
}

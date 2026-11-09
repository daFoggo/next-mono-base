import type { ComponentType, SVGProps } from "react"
import {
  IconBetterAuth,
  IconDocker,
  IconFastapi,
  IconKeycloak,
  IconNextjs,
  IconPnpm,
  IconPostgresql,
  IconSupabase,
  IconTailwind,
  IconTurborepo,
  IconVercel,
  IconZod,
} from "./stack-icons"

export interface StackItem {
  name: string
  category: "foundation" | "frontend" | "auth" | "backend" | "platform"
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  href?: string
}

/**
 * The technologies this repo actually depends on or documents a stack for, in 12 cells (4 x 3):
 * 1. Monorepo & runtime: Next.js, Turborepo, pnpm
 * 2. Frontend & contracts: Tailwind CSS, Zod
 * 3. Sign-in stacks (`AUTH_PROVIDER`): Better Auth (Neon Auth), Keycloak, Supabase
 * 4. Backend & database: PostgreSQL (Neon), FastAPI, Docker (the Keycloak and FastAPI dev servers)
 * Vercel closes the list: the multi-zone deploy in docs/routing-and-layouts.md targets it.
 */
export const STACK_ITEMS: readonly StackItem[] = [
  { name: "Next.js", category: "foundation", Icon: IconNextjs },
  { name: "Turborepo", category: "foundation", Icon: IconTurborepo },
  { name: "pnpm", category: "foundation", Icon: IconPnpm },
  { name: "Tailwind CSS", category: "frontend", Icon: IconTailwind },
  { name: "Zod", category: "frontend", Icon: IconZod },
  { name: "Better Auth", category: "auth", Icon: IconBetterAuth },
  { name: "Keycloak", category: "auth", Icon: IconKeycloak },
  { name: "Supabase", category: "auth", Icon: IconSupabase },
  { name: "PostgreSQL", category: "backend", Icon: IconPostgresql },
  { name: "FastAPI", category: "backend", Icon: IconFastapi },
  { name: "Docker", category: "backend", Icon: IconDocker },
  { name: "Vercel", category: "platform", Icon: IconVercel },
] as const

export interface StackGridProps {
  /** "default" for landing pages / full sections; "compact" for sidebars / auth rails */
  variant?: "default" | "compact"
  className?: string
}

/**
 * Clean hairline-bordered tech stack grid matching the reference bento design:
 * - 4 columns of 3 rows on sm+ viewports (12 items total; 2x6 on mobile)
 * - Centered icons + brand names
 * - Subtle hover highlighting
 * - Full light/dark mode support
 */
export function StackGrid({
  variant = "default",
  className = "",
}: StackGridProps) {
  const isCompact = variant === "compact"

  return (
    <div
      className={`grid border-t border-l border-border/40 ${
        isCompact
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-4"
      } ${className}`}
    >
      {STACK_ITEMS.map((item) => (
        <div
          key={item.name}
          className={`group flex items-center justify-center border-r border-b border-border/40 transition-colors duration-150 hover:bg-muted/30 ${
            isCompact
              ? "gap-2 px-3 py-3 text-xs"
              : "gap-3 px-4 py-6 sm:px-6 sm:py-8"
          }`}
        >
          <item.Icon
            aria-hidden="true"
            className={`shrink-0 transition-transform duration-150 group-hover:scale-105 ${
              isCompact ? "size-4 sm:size-5" : "size-5 sm:size-6"
            }`}
          />
          <span
            className={`font-medium tracking-tight text-foreground/80 transition-colors duration-150 group-hover:text-foreground ${
              isCompact ? "text-xs" : "text-sm"
            }`}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  )
}

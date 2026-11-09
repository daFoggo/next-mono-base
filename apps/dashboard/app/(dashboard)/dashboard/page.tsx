import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { PageHead } from "@/components/layout/page-head"
import { requirePermission } from "@/lib/dal"

import { TraceSheet } from "./_components/trace-sheet"

export const metadata: Metadata = { title: "Overview" }

const DOCS = "https://github.com/daFoggo/next-mono-base/blob/main/docs"

const TILES: readonly {
  title: string
  href: string
  external?: boolean
}[] = [
  {
    title: "Create an organization",
    href: "/dashboard/organizations",
  },
  {
    title: "Switch the sign-in stack",
    href: `${DOCS}/providers.md`,
    external: true,
  },
  {
    title: "Change the look",
    href: `${DOCS}/design-system.md`,
    external: true,
  },
]

async function Guard() {
  await requirePermission("account:view")
  return null
}

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={null}>
        <Guard />
      </Suspense>
      <PageHead title="Overview">
        This is your dashboard. Add sections in config/navigation.ts and pages
        under app/(dashboard).
      </PageHead>

      <section className="flex flex-col gap-5">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-medium">Get started</h2>
          <span className="text-muted-foreground">Pick a first step.</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TILES.map((tile) => {
            const body = (
              <>
                <span className="p-6 text-sm font-medium">{tile.title}</span>
              </>
            )
            const cls =
              "flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:bg-accent"
            return tile.external ? (
              <a
                key={tile.title}
                href={tile.href}
                target="_blank"
                rel="noreferrer"
                className={cls}
              >
                {body}
              </a>
            ) : (
              <Link key={tile.title} href={tile.href} className={cls}>
                {body}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-medium">Detail sheet</h2>
          <span className="text-muted-foreground">A record opens in a sheet.</span>
        </div>
        <div>
          <TraceSheet />
        </div>
      </section>
    </>
  )
}

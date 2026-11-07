import type { Metadata } from "next"
import { Suspense } from "react"

import { PageHead } from "@/components/layout/page-head"
import { SummarySkeleton } from "@/features/workspace/components/skeletons"
import { getOrg } from "@/features/workspace/queries"

export const metadata: Metadata = { title: "Organization settings" }

async function SettingsContent({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  const org = await getOrg(orgSlug)
  if (!org) return null

  return (
    <div className="flex flex-col gap-8">
      <PageHead title="Settings">
        Organization details.
      </PageHead>

      {/* General Settings */}
      <div className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/10 p-6">
        <h2 className="text-base font-medium text-foreground">Organization Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name</span>
            <p className="mt-1 text-sm font-medium text-foreground">{org.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Slug</span>
            <p className="mt-1 text-sm font-medium text-foreground">{org.slug}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Current Plan</span>
            <p className="mt-1 text-sm font-medium text-foreground">{org.plan}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrganizationSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  return (
    <Suspense fallback={<SummarySkeleton />}>
      <SettingsContent params={params} />
    </Suspense>
  )
}

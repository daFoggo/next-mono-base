import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getOrg } from "@/features/workspace/queries"
import { requirePermission } from "@/lib/dal"

async function OrgGate({
  params,
  children,
}: {
  params: Promise<{ orgSlug: string }>
  children: React.ReactNode
}) {
  await requirePermission("account:view")
  const { orgSlug } = await params
  if (!(await getOrg(orgSlug))) notFound()
  return children
}

/** Every page under `/org/<slug>`: one place checks access and that the organization exists. */
export default function OrgLayout({
  params,
  children,
}: {
  params: Promise<{ orgSlug: string }>
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <OrgGate params={params}>{children}</OrgGate>
    </Suspense>
  )
}

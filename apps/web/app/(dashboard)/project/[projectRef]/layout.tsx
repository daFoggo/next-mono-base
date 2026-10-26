import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getProject } from "@/features/workspace/queries"
import { requirePermission } from "@/lib/dal"

async function ProjectGate({
  params,
  children,
}: {
  params: Promise<{ projectRef: string }>
  children: React.ReactNode
}) {
  await requirePermission("account:view")
  const { projectRef } = await params
  if (!(await getProject(projectRef))) notFound()
  return children
}

/** Every page under `/project/<ref>`: one place checks access and that the project exists. */
export default function ProjectLayout({
  params,
  children,
}: {
  params: Promise<{ projectRef: string }>
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <ProjectGate params={params}>{children}</ProjectGate>
    </Suspense>
  )
}

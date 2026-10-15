import Link from "next/link"
import { Suspense } from "react"

import { AnnotationForm } from "@/features/cases/components/annotation-form"
import { StatusBadge } from "@/features/cases/components/status-badge"
import { getCase } from "@/features/cases/queries"

type Props = PageProps<"/dashboard/cases/[caseId]">

async function CaseContent({ params }: { params: Props["params"] }) {
  const { caseId } = await params
  const detail = await getCase(caseId)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{detail.id}</h2>
        <StatusBadge status={detail.status} />
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Started</dt>
        <dd>{detail.t_start}</dd>
        <dt className="text-muted-foreground">Ended</dt>
        <dd>{detail.t_end ?? "In progress"}</dd>
      </dl>
      <AnnotationForm detail={detail} />
    </div>
  )
}

export default function CaseServerPage(props: Props) {
  return (
    <main className="flex min-h-svh flex-col items-center gap-4 p-6">
      <div className="flex w-full max-w-md items-center justify-between">
        <h1 className="text-lg font-medium">Case</h1>
        <Link
          href="/dashboard/cases"
          className="text-sm underline underline-offset-2"
        >
          Back to cases
        </Link>
      </div>
      {/* params is request data: read it below the Suspense boundary. */}
      <Suspense fallback={<p className="text-sm">Loading case…</p>}>
        <CaseContent params={props.params} />
      </Suspense>
    </main>
  )
}

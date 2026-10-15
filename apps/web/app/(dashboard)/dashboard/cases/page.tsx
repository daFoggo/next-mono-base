import Link from "next/link"
import { Suspense } from "react"

import { CasesFilters } from "@/features/cases/components/cases-filters"
import { CasesTable } from "@/features/cases/components/cases-table"
import { getCases, getExperiments } from "@/features/cases/queries"
import { CaseListParamsSchema } from "@/features/cases/schemas"

const PATH = "/dashboard/cases"

async function CasesContent({
  searchParams,
}: {
  searchParams: PageProps<"/dashboard/cases">["searchParams"]
}) {
  // searchParams is request data: it is only read below the Suspense boundary.
  const raw = await searchParams
  const query = Object.fromEntries(
    Object.entries(raw).flatMap(([key, value]) =>
      typeof value === "string" && value !== "" ? [[key, value]] : []
    )
  )
  const parsed = CaseListParamsSchema.safeParse(query)
  const params = parsed.success ? parsed.data : CaseListParamsSchema.parse({})

  const experiments = await getExperiments()
  const experimentId = params.experiment_id ?? experiments.founds[0]?.id
  if (!experimentId) {
    return (
      <p className="text-muted-foreground text-sm">
        No experiments yet, so there are no cases to show.
      </p>
    )
  }
  const list = await getCases({ ...params, experiment_id: experimentId })

  return (
    <>
      <CasesFilters
        action={PATH}
        experiments={experiments.founds}
        experimentId={experimentId}
        status={params.status}
      />
      <CasesTable
        list={list}
        basePath={PATH}
        detailBasePath={PATH}
        query={{ experiment_id: experimentId, status: params.status }}
      />
    </>
  )
}

export default function CasesServerPage(
  props: PageProps<"/dashboard/cases">
) {
  return (
    <main className="flex min-h-svh flex-col items-center gap-4 p-6">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <h1 className="text-lg font-medium">Cases</h1>
        <Link href="/dashboard" className="text-sm underline underline-offset-2">
          Back to dashboard
        </Link>
      </div>
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <Suspense fallback={<p className="text-sm">Loading cases…</p>}>
          <CasesContent searchParams={props.searchParams} />
        </Suspense>
      </div>
    </main>
  )
}

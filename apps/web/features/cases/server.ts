import "server-only"

import { apiFetch } from "@/lib/http"

import {
  CaseDetailSchema,
  CaseListSchema,
  ExperimentListSchema,
  type AnnotationValues,
  type CaseDetail,
  type CaseList,
  type CaseListParams,
  type ExperimentList,
} from "./schemas"

export async function fetchExperiments(token: string): Promise<ExperimentList> {
  return ExperimentListSchema.parse(
    await apiFetch<unknown>("experiments?page_size=100", { token })
  )
}

export async function fetchCases(
  token: string,
  params: CaseListParams & { experiment_id: string }
): Promise<CaseList> {
  const search = new URLSearchParams({
    experiment_id: params.experiment_id,
    page: String(params.page),
    page_size: String(params.page_size),
  })
  if (params.status) search.set("status", params.status)
  return CaseListSchema.parse(
    await apiFetch<unknown>(`cases?${search}`, { token })
  )
}

export async function fetchCase(
  token: string,
  caseId: string
): Promise<CaseDetail> {
  return CaseDetailSchema.parse(
    await apiFetch<unknown>(`cases/${encodeURIComponent(caseId)}`, { token })
  )
}

export async function postAnnotation(
  token: string,
  caseId: string,
  values: AnnotationValues
): Promise<void> {
  await apiFetch<unknown>(`cases/${encodeURIComponent(caseId)}/annotation`, {
    token,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })
}

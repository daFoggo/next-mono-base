import { z } from "zod"

/** Lifecycle states of a case (`ck_cases_status` in the backend). */
export const CaseStatusSchema = z.enum([
  "annotation_free",
  "queued",
  "waiting",
  "closed",
  "asked",
  "complete",
  "auto_filled",
  "expired_unanswered",
])
export type CaseStatus = z.infer<typeof CaseStatusSchema>

export const CaseSchema = z.object({
  id: z.string(),
  experiment_id: z.string(),
  inquiry_id: z.string(),
  t_start: z.string(),
  t_end: z.string().nullable(),
  status: CaseStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
})
export type Case = z.infer<typeof CaseSchema>

/** `GET cases` */
export const CaseListSchema = z.object({
  founds: z.array(CaseSchema),
  total_count: z.number().int(),
  page: z.number().int(),
  page_size: z.number().int(),
})
export type CaseList = z.infer<typeof CaseListSchema>

/** `GET cases/{id}` */
export const CaseDetailSchema = CaseSchema.extend({
  question: z.string().nullish(),
  required_fields: z.array(z.string()).default([]),
  annotation_options: z.record(z.string(), z.array(z.string())).default({}),
  annotation: z.record(z.string(), z.string()).nullish(),
})
export type CaseDetail = z.infer<typeof CaseDetailSchema>

/** `GET experiments`: only what the picker needs. */
export const ExperimentSchema = z.object({ id: z.string(), title: z.string() })
export type Experiment = z.infer<typeof ExperimentSchema>

export const ExperimentListSchema = z.object({
  founds: z.array(ExperimentSchema),
  total_count: z.number().int(),
})
export type ExperimentList = z.infer<typeof ExperimentListSchema>

export const CaseListParamsSchema = z.object({
  /** The backend requires it. Optional here because the URL may not carry it yet. */
  experiment_id: z.string().min(1).optional(),
  status: CaseStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(10),
})
export type CaseListParams = z.infer<typeof CaseListParamsSchema>

/** Payload of `POST cases/{id}/annotation`: one answer per required field. */
export const AnnotationValuesSchema = z.record(z.string(), z.string().trim().min(1))
export type AnnotationValues = z.infer<typeof AnnotationValuesSchema>

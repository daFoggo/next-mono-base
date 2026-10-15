"use client"

import Form from "next/form"
import { useFormStatus } from "react-dom"

import type { Experiment } from "../schemas"
import { STATUS_OPTIONS } from "./status-badge"

const selectClass =
  "border-input bg-background h-9 rounded-md border px-2 text-sm"

function Pending() {
  const { pending } = useFormStatus()
  return (
    <span className="text-xs text-muted-foreground" aria-live="polite">
      {pending ? "Updating…" : ""}
    </span>
  )
}

/**
 * GET form: submitting navigates to the same page with new search params, so the server
 * re-renders the table. `next/form` does that as a client navigation (no full reload).
 */
export function CasesFilters({
  action,
  experiments,
  experimentId,
  status,
}: {
  action: string
  experiments: Experiment[]
  experimentId: string | undefined
  status: string | undefined
}) {
  const submit = (e: React.ChangeEvent<HTMLSelectElement>) =>
    e.currentTarget.form?.requestSubmit()

  return (
    <Form action={action} className="flex items-center gap-3">
      <label className="flex items-center gap-2 text-sm">
        Experiment
        <select
          name="experiment_id"
          defaultValue={experimentId}
          onChange={submit}
          className={selectClass}
        >
          {experiments.map((experiment) => (
            <option key={experiment.id} value={experiment.id}>
              {experiment.title}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        Status
        <select
          name="status"
          defaultValue={status ?? ""}
          onChange={submit}
          className={selectClass}
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <Pending />
    </Form>
  )
}

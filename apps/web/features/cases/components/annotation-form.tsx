"use client"

import { useActionState } from "react"

import { Button } from "@workspace/ui/components/button"

import { annotateCaseAction } from "../actions"
import type { CaseDetail } from "../schemas"

const inputClass =
  "border-input bg-background h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

/**
 * Plain form + Server Action. The page re-renders with fresh data because the action
 * expires the case's cache tag; no client-side cache to keep in sync.
 */
export function AnnotationForm({ detail }: { detail: CaseDetail }) {
  const [state, formAction, pending] = useActionState(annotateCaseAction, {})

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="caseId" value={detail.id} />
      {detail.question ? <p className="text-sm">{detail.question}</p> : null}
      {detail.required_fields.map((field) => {
        const options = detail.annotation_options[field]
        return (
          <label key={field} className="flex flex-col gap-1 text-sm capitalize">
            {field}
            {options?.length ? (
              <select
                name={field}
                defaultValue={detail.annotation?.[field] ?? ""}
                className={inputClass}
              >
                <option value="">Select…</option>
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                name={field}
                defaultValue={detail.annotation?.[field] ?? ""}
                className={inputClass}
              />
            )}
          </label>
        )
      })}
      {state.error ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}
      {state.ok ? <p className="text-sm">Saved.</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save annotation"}
      </Button>
    </form>
  )
}

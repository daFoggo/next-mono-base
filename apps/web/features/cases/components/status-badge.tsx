import type { CaseStatus } from "../schemas"

const LABELS: Record<CaseStatus, string> = {
  annotation_free: "No annotation",
  queued: "Queued",
  waiting: "Waiting",
  asked: "Asked",
  auto_filled: "Auto-filled",
  complete: "Complete",
  closed: "Closed",
  expired_unanswered: "Expired",
}

export const STATUS_OPTIONS = Object.entries(LABELS) as [CaseStatus, string][]

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className="rounded-full border border-border px-2 py-0.5 text-xs">
      {LABELS[status]}
    </span>
  )
}

import Link from "next/link"
import type { ReactNode } from "react"

import { EmptyState } from "@/components/shared/empty-state"
import type { Case, CaseList } from "../schemas"
import { StatusBadge } from "./status-badge"

/* -------------------------------------------------------------------------- */
/*                            Compound Components                             */
/* -------------------------------------------------------------------------- */

function CasesTableFrame({ children }: { children: ReactNode }) {
  return <table className="w-full text-left text-sm">{children}</table>
}

function CasesTableHeader({ children }: { children?: ReactNode }) {
  return (
    <thead>
      <tr className="border-b">
        {children ?? (
          <>
            <th className="py-2 font-medium">Case</th>
            <th className="py-2 font-medium">Started</th>
            <th className="py-2 font-medium">Status</th>
          </>
        )}
      </tr>
    </thead>
  )
}

function CasesTableRow({
  item,
  detailBasePath,
  renderActions,
}: {
  item: Case
  detailBasePath: string
  renderActions?: (item: Case) => ReactNode
}) {
  return (
    <tr key={item.id} className="border-b">
      <td className="py-2">
        <Link
          href={`${detailBasePath}/${item.id}`}
          className="underline underline-offset-2"
        >
          {item.id}
        </Link>
      </td>
      <td className="py-2">{item.t_start}</td>
      <td className="py-2">
        <StatusBadge status={item.status} />
      </td>
      {renderActions ? <td className="py-2">{renderActions(item)}</td> : null}
    </tr>
  )
}

function CasesTableEmpty({
  message = "No cases match this filter.",
}: {
  message?: string
}) {
  return (
    <tbody>
      <tr>
        <td colSpan={3} className="py-6 text-center">
          <EmptyState title={message} />
        </td>
      </tr>
    </tbody>
  )
}

function CasesTablePagination({
  page,
  totalPages,
  totalCount,
  getPageHref,
}: {
  page: number
  totalPages: number
  totalCount: number
  getPageHref: (page: number) => string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>
        Page {page} of {totalPages} · {totalCount} cases
      </span>
      <div className="flex gap-3">
        {page > 1 ? (
          <Link
            href={getPageHref(page - 1)}
            className="underline underline-offset-2"
          >
            Previous
          </Link>
        ) : null}
        {page < totalPages ? (
          <Link
            href={getPageHref(page + 1)}
            className="underline underline-offset-2"
          >
            Next
          </Link>
        ) : null}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                      Default Variant (Drop-in Export)                      */
/* -------------------------------------------------------------------------- */

/**
 * Server Component: renders case rows and pagination without client JS.
 * Supports compound subcomponents for customized composition.
 */
export function CasesTable({
  list,
  basePath,
  detailBasePath,
  query,
}: {
  list: CaseList
  basePath: string
  detailBasePath: string
  query: Record<string, string | undefined>
}) {
  const pages = Math.max(1, Math.ceil(list.total_count / list.page_size))

  const pageHref = (page: number) => {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(query)) {
      if (value) search.set(key, value)
    }
    search.set("page", String(page))
    return `${basePath}?${search}`
  }

  if (list.founds.length === 0) {
    return (
      <CasesTableFrame>
        <CasesTableHeader />
        <CasesTableEmpty />
      </CasesTableFrame>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <CasesTableFrame>
        <CasesTableHeader />
        <tbody>
          {list.founds.map((item) => (
            <CasesTableRow
              key={item.id}
              item={item}
              detailBasePath={detailBasePath}
            />
          ))}
        </tbody>
      </CasesTableFrame>

      <CasesTablePagination
        page={list.page}
        totalPages={pages}
        totalCount={list.total_count}
        getPageHref={pageHref}
      />
    </div>
  )
}

// Attach compound subcomponents to CasesTable
CasesTable.Frame = CasesTableFrame
CasesTable.Header = CasesTableHeader
CasesTable.Row = CasesTableRow
CasesTable.Empty = CasesTableEmpty
CasesTable.Pagination = CasesTablePagination

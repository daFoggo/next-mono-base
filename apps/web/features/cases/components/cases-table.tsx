import Link from "next/link"

import type { CaseList } from "../schemas"
import { StatusBadge } from "./status-badge"

/** Server Component: rendered with the data, no client JS for the table or pagination. */
export function CasesTable({
  list,
  basePath,
  detailBasePath,
  query,
}: {
  list: CaseList
  /** Page path, used to build pagination links. */
  basePath: string
  detailBasePath: string
  /** Current filters, kept in the pagination links. */
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

  return (
    <>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 font-medium">Case</th>
            <th className="py-2 font-medium">Started</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {list.founds.map((item) => (
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
            </tr>
          ))}
          {list.founds.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-muted-foreground py-6 text-center">
                No cases match this filter.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div className="flex items-center justify-between text-sm">
        <span>
          Page {list.page} of {pages} · {list.total_count} cases
        </span>
        <div className="flex gap-3">
          {list.page > 1 ? (
            <Link href={pageHref(list.page - 1)} className="underline underline-offset-2">
              Previous
            </Link>
          ) : null}
          {list.page < pages ? (
            <Link href={pageHref(list.page + 1)} className="underline underline-offset-2">
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </>
  )
}

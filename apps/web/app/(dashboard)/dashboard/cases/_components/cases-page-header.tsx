import Link from "next/link"

/**
 * Page-local component: only used on /dashboard/cases.
 * Private folder convention: Next.js ignores `_` folders from routing.
 */
export function CasesPageHeader() {
  return (
    <div className="flex w-full max-w-3xl items-center justify-between">
      <h1 className="text-lg font-medium">Cases</h1>
      <Link href="/dashboard" className="text-sm underline underline-offset-2">
        Back to dashboard
      </Link>
    </div>
  )
}

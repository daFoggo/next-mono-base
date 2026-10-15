import { Suspense } from "react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { signOutAction } from "@/features/auth/actions"
import { authConfig } from "@/lib/auth/config"
import { verifySession } from "@/lib/dal"

async function SessionCard() {
  const session = await verifySession()

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Session Details
          </span>
          <p className="mt-1 font-mono text-sm break-all">
            <span className="text-muted-foreground">User ID: </span>
            {session.userId}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Auth Provider: <span className="font-medium text-foreground">{authConfig.AUTH_PROVIDER}</span>
          </p>
        </div>

        <div className="pt-2">
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function SessionSkeleton() {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-9 w-full" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Authenticated area protected by Data Access Layer (<code className="rounded bg-muted px-1 py-0.5 text-xs">verifySession()</code>).
        </p>
      </div>

      <Suspense fallback={<SessionSkeleton />}>
        <SessionCard />
      </Suspense>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <Link href="/" className="underline underline-offset-4 hover:text-foreground">
          Home
        </Link>
        <span>•</span>
        <span>Next.js 16.4</span>
        <span>•</span>
        <span>Turborepo</span>
      </div>
    </main>
  )
}

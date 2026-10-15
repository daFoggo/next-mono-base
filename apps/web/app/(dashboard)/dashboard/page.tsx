import { Suspense } from "react"

import { Button } from "@workspace/ui/components/button"

import { signOutAction } from "@/features/auth/actions"
import { verifySession } from "@/lib/dal"

async function SessionInfo() {
  const session = await verifySession()
  return (
    <>
      <p className="text-sm">Signed in as {session.userId}</p>
      <form action={signOutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </>
  )
}

export default function DashboardPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-lg font-medium">Dashboard</h1>
      <Suspense fallback={<p className="text-sm">Loading…</p>}>
        <SessionInfo />
      </Suspense>
    </main>
  )
}

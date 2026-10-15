import Link from "next/link"
import { Suspense } from "react"

import { Button } from "@workspace/ui/components/button"

import { signOutAction } from "@/features/auth/actions"
import { ProfileForm } from "@/features/profile/components/profile-form"
import { getProfile } from "@/features/profile/queries"
import { authConfig } from "@/lib/auth/config"
import { verifySession } from "@/lib/dal"

async function SessionInfo() {
  const session = await verifySession()
  // The profile lives in the app backend; a Supabase-only deployment has no such API.
  const profile =
    authConfig.AUTH_PROVIDER === "backend" ? await getProfile() : null
  return (
    <>
      <p className="text-sm">Signed in as {session.userId}</p>
      {profile ? <ProfileForm profile={profile} /> : null}
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
      <Link href="/dashboard/cases" className="text-sm underline underline-offset-2">
        Cases
      </Link>
      <Suspense fallback={<p className="text-sm">Loading…</p>}>
        <SessionInfo />
      </Suspense>
    </main>
  )
}

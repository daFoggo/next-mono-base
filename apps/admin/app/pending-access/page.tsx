import type { Metadata } from "next"
import { Suspense } from "react"

import { SignOutButton } from "@/features/auth/components/sign-out-button"
import { verifySession } from "@/lib/dal"

import {
  AuthBody,
  AuthHeader,
  AuthHeading,
} from "../(auth)/_components/auth-frame"

export const metadata: Metadata = { title: "Pending access" }

async function Account() {
  const session = await verifySession()
  return (
    <p className="text-muted-foreground">
      You are signed in as{" "}
      <span className="font-medium text-foreground">{session.email}</span>.
    </p>
  )
}

/** Signed-in accounts without a staff role land here (proxy `adminGate`). */
export default function PendingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AuthHeader>{null}</AuthHeader>
      <AuthBody>
        <AuthHeading eyebrow="Admin" title="Pending access">
          Your account exists. An administrator must grant you the Editor or
          Admin role; then sign out and sign in again.
        </AuthHeading>
        <Suspense>
          <Account />
        </Suspense>
        <SignOutButton />
      </AuthBody>
    </div>
  )
}

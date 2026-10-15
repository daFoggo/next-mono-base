import { Suspense } from "react"

import { authConfig } from "@/lib/auth/config"
import { SignInForm } from "@/features/auth/components/sign-in-form"

async function OAuthError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  if (!error) return null
  return (
    <p role="alert" className="text-destructive text-sm">
      Sign-in with the provider failed. Please try again.
    </p>
  )
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-lg font-medium">Sign in</h1>
      <Suspense>
        <OAuthError searchParams={searchParams} />
      </Suspense>
      <SignInForm showGoogle={authConfig.AUTH_PROVIDER === "supabase"} />
    </main>
  )
}

import Link from "next/link"
import { Suspense } from "react"

import { FormError } from "@/features/auth/components/form-error"
import { SignInForm } from "@/features/auth/components/sign-in-form"
import { authConfig } from "@/lib/auth/config"

async function OAuthError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  if (!error) return null
  return (
    <FormError message="Sign-in with the provider failed. Please try again." />
  )
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-medium lg:text-3xl">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Suspense>
          <OAuthError searchParams={searchParams} />
        </Suspense>
        <SignInForm showGoogle={authConfig.AUTH_PROVIDER === "supabase"} />
      </div>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        No account yet?{" "}
        <Link
          href="/sign-up"
          className="hover:text-foreground font-medium underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </>
  )
}

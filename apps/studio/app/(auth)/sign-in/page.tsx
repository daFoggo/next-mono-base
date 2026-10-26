import type { Metadata } from "next"
import { Suspense } from "react"

import { DemoSignInButton } from "@workspace/auth-ui/demo-sign-in-button"
import { FormError } from "@workspace/auth-ui/form-error"
import { SignInForm } from "@workspace/auth-ui/sign-in-form"

import { SIGN_UP_PATH } from "@/config/routes"
import { demoSignInAction, signInAction } from "@/features/auth/actions"
import { demoAuthSecret } from "@/lib/demo-session"

import {
  AuthAside,
  AuthBody,
  AuthHeader,
  AuthHeading,
  AuthMain,
  AuthPitch,
  AuthSwitch,
} from "../_components/auth-frame"
import { StackShowcase } from "../_components/stack-showcase"

export const metadata: Metadata = { title: "Sign in" }

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
      <AuthAside>
        <AuthPitch title="Pick up where you left off.">
          Your workspace is one sign-in away.
        </AuthPitch>
        <StackShowcase />
      </AuthAside>
      <AuthMain>
        <AuthHeader>
          <AuthSwitch prompt="No account?" href={SIGN_UP_PATH}>
            Sign up
          </AuthSwitch>
        </AuthHeader>
        <AuthBody>
          <AuthHeading eyebrow="Sign in" title="Welcome back">
            Sign in to your account.
          </AuthHeading>
          <div className="flex flex-col gap-4">
            <Suspense>
              <OAuthError searchParams={searchParams} />
            </Suspense>
            <SignInForm action={signInAction} />
            {demoAuthSecret() !== null ? (
              <DemoSignInButton action={demoSignInAction} />
            ) : null}
            {/* Google is disabled; enable the provider in Supabase, then render `<OAuthButton action={signInWithGoogleAction}>Continue with Google</OAuthButton>` from @workspace/auth-ui/oauth-button. */}
          </div>
        </AuthBody>
      </AuthMain>
    </>
  )
}

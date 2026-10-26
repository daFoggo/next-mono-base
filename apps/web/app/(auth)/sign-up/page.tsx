import type { Metadata } from "next"

import { SIGN_IN_PATH } from "@/config/routes"
import { SignUpForm } from "@/features/auth/components/sign-up-form"

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

export const metadata: Metadata = { title: "Sign up" }

export default function SignUpPage() {
  return (
    <>
      <AuthAside>
        <AuthPitch title="Start from a solid base.">
          Create an account and set up your workspace in a minute.
        </AuthPitch>
        <StackShowcase />
      </AuthAside>
      <AuthMain>
        <AuthHeader>
          <AuthSwitch prompt="Already have an account?" href={SIGN_IN_PATH}>
            Sign in
          </AuthSwitch>
        </AuthHeader>
        <AuthBody>
          <AuthHeading eyebrow="Sign up" title="Create an account">
            Create an account to get started.
          </AuthHeading>
          <SignUpForm />
        </AuthBody>
      </AuthMain>
    </>
  )
}

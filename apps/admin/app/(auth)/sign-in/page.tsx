import type { Metadata } from "next"

import { SIGN_UP_PATH } from "@/config/routes"
import { SignInForm } from "@/features/auth/components/sign-in-form"

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

export default function SignInPage() {
  return (
    <>
      <AuthAside>
        <AuthPitch title="Back to the control room.">
          Manage the workspace with your staff account.
        </AuthPitch>
        <StackShowcase />
      </AuthAside>
      <AuthMain>
      <AuthHeader>
        <AuthSwitch prompt="New staff?" href={SIGN_UP_PATH}>
          Sign up
        </AuthSwitch>
      </AuthHeader>
      <AuthBody>
        <AuthHeading eyebrow="Admin" title="Sign in">
          Use your Next Mono Base staff account.
        </AuthHeading>
        <SignInForm />
      </AuthBody>
      </AuthMain>
    </>
  )
}

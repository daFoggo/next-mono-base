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
        <AuthPitch title="Join the staff.">
          Create an account, then an administrator grants you access.
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
        <AuthHeading eyebrow="Admin" title="Create a staff account">
          After signing up, an administrator must grant you access before you can enter.
        </AuthHeading>
        <SignUpForm />
      </AuthBody>
      </AuthMain>
    </>
  )
}

import Link from "next/link"

import { SignUpForm } from "@/features/auth/components/sign-up-form"

export default function SignUpPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-medium lg:text-3xl">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started in a minute.
        </p>
      </div>
      <SignUpForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium underline underline-offset-4 hover:text-foreground"
        >
          Sign in
        </Link>
      </p>
    </>
  )
}

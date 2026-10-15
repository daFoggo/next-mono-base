import Link from "next/link"

import { SignUpForm } from "@/features/auth/components/sign-up-form"

export default function SignUpPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-medium lg:text-3xl">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">Get started in a minute.</p>
      </div>
      <SignUpForm />
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="hover:text-foreground font-medium underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </>
  )
}

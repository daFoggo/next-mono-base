"use client"

import { useActionState } from "react"

import { Button } from "@workspace/ui/components/button"

import { signInAction, signInWithGoogleAction } from "../actions"

const inputClass =
  "border-input bg-background h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function SignInForm({ showGoogle }: { showGoogle: boolean }) {
  const [state, formAction, pending] = useActionState(signInAction, {})

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            className={inputClass}
          />
        </label>
        {state.error ? (
          <p role="alert" className="text-destructive text-sm">
            {state.error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {showGoogle ? (
        <form action={signInWithGoogleAction}>
          <Button type="submit" variant="outline" className="w-full">
            Continue with Google
          </Button>
        </form>
      ) : null}
    </div>
  )
}

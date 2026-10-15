"use client"

import { useActionState } from "react"

import { Button } from "@workspace/ui/components/button"

import { updateProfileAction } from "../actions"
import type { Profile } from "../schemas"

const inputClass =
  "border-input bg-background h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {})

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          name="name"
          defaultValue={profile.name}
          required
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Timezone
        <input
          name="timezone"
          defaultValue={profile.timezone}
          required
          className={inputClass}
        />
      </label>
      {state.error ? (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      ) : null}
      {state.saved ? <p className="text-sm">Saved.</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  )
}

"use client"

import { useEffect } from "react"

import { Button } from "@workspace/ui/components/button"

/** Unexpected errors only; expected failures are returned by Server Actions as values. */
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-lg font-medium">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  )
}

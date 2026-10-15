"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center font-sans">
        <h1 className="text-xl font-semibold">Application error</h1>
        <p className="text-sm text-gray-500">
          A critical error occurred. Please refresh or try again.
        </p>
        <button
          onClick={() => reset()}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-black"
        >
          Try again
        </button>
      </body>
    </html>
  )
}

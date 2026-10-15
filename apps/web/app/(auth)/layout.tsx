import Link from "next/link"

/** Shared frame for the sign-in / sign-up pages. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex min-h-svh flex-col">
      <header className="px-6 py-6 sm:px-8">
        <Link href="/" className="text-base font-semibold">
          App
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center px-6 py-8">
        <div className="flex w-full max-w-sm flex-1 flex-col justify-center">
          {children}
        </div>
        <p className="text-muted-foreground mt-8 max-w-sm text-center text-xs text-balance">
          By continuing, you agree to the Terms of Service and Privacy Policy.
        </p>
      </main>
    </div>
  )
}

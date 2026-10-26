import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

import { AppLogo } from "@/components/shared/app-logo"
import { CONTAINER } from "@/config/layout"
import { SIGN_IN_PATH, SIGN_UP_PATH } from "@/config/routes"

export default function HomePage() {
  return (
    <main className={`${CONTAINER} flex min-h-svh flex-col justify-center gap-6`}>
      <AppLogo size="lg" />
      <h1 className="text-5xl leading-tight font-normal tracking-tighter">
        Build on a solid base
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Next.js, Turborepo, shared auth and data packages, and a design system.
        Replace this page with your product.
      </p>
      <div className="flex gap-3">
        <Button size="lg" render={<Link href={SIGN_IN_PATH} />} nativeButton={false}>
          Sign in
        </Button>
        <Button
          size="lg"
          variant="outline"
          render={<Link href={SIGN_UP_PATH} />}
          nativeButton={false}
        >
          Sign up
        </Button>
      </div>
    </main>
  )
}

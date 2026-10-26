import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { GlyphBackground } from "@workspace/ui/components/animate-ui/backgrounds/glyph"

import { ThemeCommand } from "@/components/layout/header-commands"
import { Stagger } from "@/components/shared/stagger"
import { AppLogo } from "@/components/shared/app-logo"

/** Left rail from lg: wordmark, page-specific showcase centered, footer. Hidden below lg. */
export function AuthAside({ children }: { children: React.ReactNode }) {
  return (
    <aside className="hidden border-r lg:sticky lg:top-0 lg:col-span-6 lg:flex lg:h-svh lg:flex-col xl:col-span-7">
      <GlyphBackground className="flex flex-1 flex-col px-9 text-foreground">
        <div className="relative flex h-24 shrink-0 items-center">
          <Link href="/">
            <AppLogo size="lg" />
          </Link>
        </div>
        <div className="relative flex flex-1 flex-col justify-center">
          <div className="flex flex-col gap-8 text-foreground">{children}</div>
        </div>
        {/* Same height as the header so the showcase stays vertically centered. */}
        <div className="relative flex h-24 shrink-0 items-center justify-between font-mono text-xs text-muted-foreground">
          <span>© 2026 Next Mono Base</span>
          <ThemeCommand />
        </div>
      </GlyphBackground>
    </aside>
  )
}

/** Rail headline: title plus a one-line standfirst. */
export function AuthPitch({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <p className="text-3xl leading-tight font-medium text-balance md:text-4xl">
        {title}
      </p>
      <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

/** Form column: header, centered body, terms footer. */
export function AuthMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-svh flex-col px-9 max-sm:px-6 lg:col-span-6 xl:col-span-5">
      {children}
      <p className="py-8 text-center font-mono text-xs text-balance text-muted-foreground">
        By continuing, you agree to the Terms of Service and Privacy Policy.
      </p>
    </main>
  )
}

/** Top bar of the form column; the logo shows here only while the rail is hidden. */
export function AuthHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="flex h-24 items-center justify-between gap-4 max-sm:h-18">
      <Link href="/" className="lg:invisible">
        <AppLogo size="md" />
      </Link>
      {children}
    </header>
  )
}

/** Link to the other auth page, e.g. "No account? Sign up →". */
export function AuthSwitch({
  prompt,
  href,
  children,
}: {
  prompt: string
  href: string
  children: React.ReactNode
}) {
  return (
    <p className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
      <span className="max-sm:hidden">{prompt}</span>
      <Link
        href={href}
        className="group flex items-center gap-1.5 text-foreground transition-colors duration-150 hover:text-muted-foreground"
      >
        {children}
        <IconArrowRight
          aria-hidden
          className="size-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:translate-x-1"
        />
      </Link>
    </p>
  )
}

/** Centered column holding the heading and the form. */
export function AuthBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center py-12 max-sm:py-8">
      <Stagger className="mx-auto flex w-full max-w-sm flex-col gap-8">
        {children}
      </Stagger>
    </div>
  )
}

export function AuthHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {eyebrow}
      </span>
      <h1 className="text-3xl leading-tight font-medium md:text-4xl">
        {title}
      </h1>
      <p className="text-muted-foreground">{children}</p>
    </div>
  )
}

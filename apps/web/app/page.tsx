import { IconBrandGithub } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { AppLogo } from "@workspace/ui-patterns/app-logo"
import { StackGrid } from "@workspace/ui-patterns/stack-grid"
import { ThemeToggle } from "@workspace/ui-patterns/theme-toggle"

import { CONTAINER } from "@/config/layout"
import { REPO_URL, SIGN_IN_HREF, SIGN_UP_HREF } from "@/config/site"

const FEATURES = [
  {
    title: "Next.js 16 Monorepo",
    text: "pnpm workspaces + Turborepo: Next.js 16.4 App Router with PPR and Cache Components, cleanly separated into shared UI, auth, and data packages.",
  },
  {
    title: "Pluggable Auth Providers",
    text: "Built-in support for Keycloak 26 OIDC, Better Auth, or Supabase behind one @workspace/auth seam. Switch via AUTH_PROVIDER with zero code churn.",
  },
  {
    title: "Modular Backend & Data",
    text: "Engineered for PostgreSQL with connection pooling. Plug in Docker environments, Redis caching, or a FastAPI Python service as needed.",
  },
  {
    title: "Client State & Contracts",
    text: "Zustand for client-only shared state without provider bloat, paired with Zod runtime schema validation across all data boundaries.",
  },
  {
    title: "Zinc Design System",
    text: "shadcn base-nova on zinc theme with Animate UI v2 spring physics, dark mode default, ready-made dashboard shell and detail sheets.",
  },
  {
    title: "AI & Skill Workflow",
    text: "Comprehensive engineering docs, Claude AI skill definitions, and strict monorepo rules for deterministic agentic pair programming.",
  },
] as const

/** Landing page. The product itself lives in apps/studio; this app only links to it. */
export default function HomePage() {
  return (
    <>
      <header className="border-b">
        <div className={`${CONTAINER} flex h-14 items-center gap-4`}>
          <AppLogo />
          <nav className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              render={<a href={SIGN_IN_HREF} />}
              nativeButton={false}
            >
              Sign in
            </Button>
            <Button render={<a href={SIGN_UP_HREF} />} nativeButton={false}>
              Get started
            </Button>
          </nav>
        </div>
      </header>

      <main className={`${CONTAINER} flex flex-col gap-14 pt-20 pb-14`}>
        {/* Hero Section */}
        <section className="flex flex-col gap-6">
          <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Modular Next.js monorepo starter
          </p>
          <h1 className="max-w-3xl text-5xl leading-tight font-normal tracking-tighter">
            Build on a solid base
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A production-grade Next.js 16.4 monorepo starter designed to be modular.
            Choose your preferred auth provider (Keycloak, Better Auth, or Supabase),
            plug in your database, and build with strict architectural best practices.
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              variant="ghost"
              render={<a href={SIGN_IN_HREF} />}
              nativeButton={false}
            >
              Sign in
            </Button>
            <Button
              size="lg"
              render={<a href={SIGN_UP_HREF} />}
              nativeButton={false}
            >
              Get started
            </Button>
          </div>
        </section>

        {/* Supported Ecosystem Section */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Supported Ecosystem &amp; Integrations
            </p>
            <h2 className="text-2xl font-normal tracking-tight sm:text-3xl text-balance">
              Supported technologies &amp; integrations
            </h2>
            <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
              This starter base is built around Next.js and provides first-class, pluggable support
              for your choice of authentication providers, databases, and deployment targets.
            </p>
          </div>

          <StackGrid />
        </section>

        {/* Core Architecture Features */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-3">
              <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.text}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className={`${CONTAINER} flex h-14 items-center`}>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <IconBrandGithub aria-hidden className="size-4" />
            daFoggo/next-mono-base
          </a>
        </div>
      </footer>
    </>
  )
}

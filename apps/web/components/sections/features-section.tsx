import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "@workspace/ui/lib/utils"

import {
  ChecksPanel,
  DesignPanel,
  PackagesPanel,
  StacksPanel,
} from "@/components/panels"
import { SectionNav } from "@/components/section-nav"
import { GUTTER } from "@/config/layout"
import { REPO_URL, docsHref } from "@/config/site"

const ROWS = [
  {
    id: "stacks",
    nav: "Sign-in and data",
    title: "AUTH_PROVIDER picks the sign-in and the database.",
    text: "neon-auth, supabase, keycloak, fastapi-oauth or demo. Only neon-auth has a real database path today; the others keep the sample workspace in memory and warn at startup.",
    link: { label: "Read providers.md", href: docsHref("providers.md") },
    Panel: StacksPanel,
  },
  {
    id: "packages",
    nav: "Packages",
    title: "Apps run. Packages are shared.",
    text: "The dashboard and this landing page share auth, database, UI and lint config through pnpm workspaces and Turborepo. Dependencies go in the package that uses them.",
    link: { label: "Read project-structure.md", href: docsHref("project-structure.md") },
    Panel: PackagesPanel,
  },
  {
    id: "design",
    nav: "Design system",
    title: "The look is one file.",
    text: "Components read the shadcn tokens in globals.css. Restyling means editing tokens, not component files, so you can preview upstream shadcn and Animate UI updates with shadcn add --diff before applying them.",
    link: { label: "Read design-system.md", href: docsHref("design-system.md") },
    Panel: DesignPanel,
  },
  {
    id: "checks",
    nav: "Checks",
    title: "pnpm check, then ship.",
    text: "Lint, typecheck and tests run in every package through Turborepo. ESLint stops features from importing each other or the app layer.",
    link: { label: "Read CONTRIBUTING.md", href: `${REPO_URL}/blob/main/CONTRIBUTING.md` },
    Panel: ChecksPanel,
  },
] as const

const NAV = ROWS.map(({ id, nav }) => ({ id, label: nav }))

export function FeaturesSection() {
  return (
    <section className="border-b">
      <div className="border-b px-5 py-32 text-center max-sm:py-20">
        <h2 className="mx-auto max-w-3xl text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          What is in the repo.
        </h2>
      </div>

      <div className={`${GUTTER} grid grid-cols-1 lg:grid-cols-12`}>
        <div className="p-9 max-lg:hidden lg:col-span-3">
          <SectionNav items={NAV} />
        </div>
        <div className="flex flex-col lg:col-span-9 lg:border-l">
          {ROWS.map((row, i) => (
            <article
              key={row.id}
              id={row.id}
              className="grid scroll-mt-11 grid-cols-1 items-center gap-8 border-b px-5 py-8 last:border-b-0 sm:p-9 lg:grid-cols-5"
            >
              <div
                className={cn(
                  "flex flex-col gap-5 lg:col-span-2",
                  i % 2 === 1 && "lg:order-last"
                )}
              >
                <h3 className="text-2xl font-medium tracking-tight text-balance">
                  {row.title}
                </h3>
                <p className="text-base leading-relaxed">{row.text}</p>
                <a
                  href={row.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-fit items-center gap-2 text-sm font-medium"
                >
                  {row.link.label}
                  <IconChevronRight aria-hidden className="size-4" />
                </a>
              </div>
              <div className="lg:col-span-3">
                <row.Panel />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

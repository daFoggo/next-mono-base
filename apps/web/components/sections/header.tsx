import Link from "next/link"

import { AppLogo } from "@workspace/ui-patterns/app-logo"

import { StartMenu } from "@/components/start-menu"
import { REPO_URL, SIGN_IN_HREF, dashboardHref } from "@/config/site"

const LINKS = [
  { href: "/#stacks", label: "Stacks" },
  { href: "/#packages", label: "Packages" },
  { href: "/#design", label: "Design" },
  { href: "/#checks", label: "Checks" },
] as const

const CELL =
  "flex items-center border-r px-6 text-base font-medium transition-colors hover:bg-accent"

const MENU = [
  [{ label: "Dashboard", href: dashboardHref("/dashboard"), sprite: "dashboard" }],
  [
    { label: "GitHub", href: REPO_URL, sprite: "code", external: true },
    {
      label: "Docs",
      href: `${REPO_URL}/tree/main/docs`,
      sprite: "book",
      external: true,
    },
  ],
] as const

/** Full-bleed 56px bar cut into hairline cells: logo | sections | sign in | menu. */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="flex h-14 items-stretch">
        <Link href="/" className="flex items-center border-r px-4">
          <AppLogo />
        </Link>
        <nav aria-label="Sections" className="flex items-stretch max-md:hidden">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={CELL}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-stretch">
          <a
            href={SIGN_IN_HREF}
            className={`${CELL} border-r-0 border-l max-sm:hidden`}
          >
            Sign in
          </a>
          <StartMenu label="Explore" groups={MENU} />
        </div>
      </div>
    </header>
  )
}

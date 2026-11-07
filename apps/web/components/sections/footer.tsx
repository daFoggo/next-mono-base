import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"

import { AppLogo } from "@workspace/ui-patterns/app-logo"
import { ThemeToggle } from "@workspace/ui-patterns/theme-toggle"

import { GUTTER } from "@/config/layout"
import { REPO_URL, SIGN_IN_HREF } from "@/config/site"

const COLUMNS = [
  {
    title: "Project",
    links: [
      { label: "GitHub", href: REPO_URL, external: true },
      { label: "Dashboard", href: SIGN_IN_HREF, external: false },
    ],
  },
  {
    title: "Contribute",
    links: [
      { label: "Contributing guide", href: `${REPO_URL}/blob/main/CONTRIBUTING.md`, external: true },
      { label: "Agent rules", href: `${REPO_URL}/blob/main/AGENTS.md`, external: true },
      { label: "All docs", href: `${REPO_URL}/tree/main/docs`, external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms", external: false },
      { label: "Privacy", href: "/privacy", external: false },
    ],
  },
] as const

const LINK = "w-fit text-base font-medium transition-colors hover:text-muted-foreground"

export function Footer() {
  return (
    <footer>
      <div className={`${GUTTER} grid grid-cols-1 md:grid-cols-3`}>
        {COLUMNS.map((column) => (
          <div
            key={column.title}
            className="flex flex-col gap-3 border-b p-9 md:border-r md:border-b-0 md:last:border-r-0"
          >
            <h3 className="mb-3 text-base text-muted-foreground">
              {column.title}
            </h3>
            {column.links.map((link) =>
              link.href.startsWith("/") ? (
                <Link key={link.label} href={link.href} className={LINK}>
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className={LINK}
                >
                  {link.label}
                </a>
              )
            )}
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className={`${GUTTER} px-9 pt-6`}>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="block w-fit transition-colors hover:text-muted-foreground"
          >
            <IconBrandGithub aria-hidden className="size-6" />
          </a>
        </div>
        <div className={`${GUTTER} flex items-center justify-between px-9 py-6`}>
          <span className="text-sm text-muted-foreground">
            © 2026 Next Mono Base · MIT License
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <AppLogo variant="mark" size="xl" motion="static" />
      </div>
      <div>
        <span className="block h-14 bg-chart-3" />
        <span className="block h-14 bg-chart-2" />
        <span className="block h-14 bg-chart-1" />
        <span className="block h-14 bg-chart-4" />
      </div>
    </footer>
  )
}

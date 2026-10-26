"use client"

import { usePathname } from "next/navigation"

import { NAV_SECTIONS } from "@/config/navigation"

/** "Content / Products"; below `sm` only the current page (A1). */
export function AdminBreadcrumb() {
  const pathname = usePathname()
  for (const section of NAV_SECTIONS) {
    for (const link of section.links) {
      const match =
        link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
      if (!match) continue
      return (
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-sm"
        >
          {section.title !== link.title ? (
            <>
              <span className="text-muted-foreground max-sm:hidden">{section.title}</span>
              <span className="text-muted-foreground/50 max-sm:hidden" aria-hidden>
                /
              </span>
            </>
          ) : null}
          <span
            className="truncate font-medium text-foreground"
            aria-current="page"
          >
            {link.title}
          </span>
        </nav>
      )
    }
  }
  return null
}

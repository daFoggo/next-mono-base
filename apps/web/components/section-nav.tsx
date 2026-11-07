"use client"

import { useEffect, useState } from "react"
import { IconArrowRight } from "@tabler/icons-react"

import { cn } from "@workspace/ui/lib/utils"

/** Sticky list on the left of the feature rows; the row in view turns bright and gets an arrow. */
export function SectionNav({
  items,
}: {
  items: readonly { id: string; label: string }[]
}) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const seen = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.intersectionRatio)
        let best: string | undefined
        let ratio = 0
        for (const [id, r] of seen) if (r > ratio) [best, ratio] = [id, r]
        if (best) setActive(best)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    for (const { id } of items) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [items])

  return (
    <nav
      aria-label="Features"
      className="sticky top-20 flex flex-col divide-y rounded-2xl border bg-card max-lg:hidden"
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className={cn(
            "flex items-center justify-between px-5 py-4 text-base font-medium transition-colors",
            active === item.id
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label}
          {active === item.id ? <IconArrowRight aria-hidden className="size-4" /> : null}
        </a>
      ))}
    </nav>
  )
}

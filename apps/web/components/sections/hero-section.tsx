import { IconChevronRight } from "@tabler/icons-react"

import { PixelArt } from "@workspace/ui-patterns/pixel-art"

/** Flat colored blocks, diamonds and two sprites along the edges, like a level seen from the side. Decorative. */
function Scene() {
  return (
    <div aria-hidden className="max-lg:hidden">
      <div className="absolute bottom-0 left-0 flex items-end">
        <div className="relative flex flex-col">
          <PixelArt name="key" size="sm" className="absolute -top-10 left-6" />
          <span className="block size-28 bg-chart-3" />
          <span className="block size-28 bg-chart-2" />
        </div>
        <span className="block size-28 bg-chart-1" />
        <span className="ml-8 block size-14 bg-chart-3" />
      </div>
      <div className="absolute right-0 bottom-0 flex flex-col items-end">
        <span className="mr-10 mb-10 block size-20 rotate-45 bg-chart-1" />
        <PixelArt name="lock" size="sm" className="mr-6 -mb-4" />
        <span className="block size-28 bg-chart-3" />
        <span className="block size-28 bg-chart-2" />
      </div>
      <span className="absolute right-40 bottom-32 block size-14 rotate-45 bg-chart-1" />
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden border-b px-5 py-40 text-center">
      <Scene />
      <h1 className="relative max-w-5xl text-5xl font-medium tracking-tight text-balance sm:text-7xl lg:text-8xl">
        Sign-in and data, already wired
        <PixelArt
          name="plug"
          size="sm"
          className="ml-4 hidden align-middle sm:inline-block"
        />
      </h1>
      <p className="relative mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground max-sm:text-base">
        A Next.js monorepo: a dashboard, a landing page and shared packages.
      </p>
      <a
        href="#stacks"
        className="relative mt-12 flex h-14 items-center gap-10 rounded-2xl border bg-card px-6 text-base font-medium transition-colors hover:bg-accent"
      >
        Neon Auth with Neon Postgres is the default stack
        <IconChevronRight aria-hidden className="size-4" />
      </a>
    </section>
  )
}

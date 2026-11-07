import { IconChevronRight } from "@tabler/icons-react"

import { CopyCommand } from "@/components/copy-command"
import { Tint } from "@/components/sections/tint"
import { GUTTER } from "@/config/layout"
import { SIGN_IN_HREF } from "@/config/site"

export function WorkSection() {
  return (
    <section className="relative border-b py-24 max-sm:py-16">
      <Tint className="bg-card" />
      <div
        className={`${GUTTER} flex flex-col gap-10 px-9 md:flex-row md:items-end md:justify-between`}
      >
        <div className="flex flex-col gap-8">
          <h2 className="text-4xl font-medium tracking-tight sm:text-5xl">
            See it running.
          </h2>
          <CopyCommand command="git clone https://github.com/daFoggo/next-mono-base.git" />
        </div>
        <a
          href={SIGN_IN_HREF}
          className="flex h-12 w-fit items-center gap-6 rounded-md bg-accent px-5 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Open the dashboard
          <IconChevronRight aria-hidden className="size-4" />
        </a>
      </div>
    </section>
  )
}

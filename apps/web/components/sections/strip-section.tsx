import type { ComponentType, SVGProps } from "react"

import {
  IconNextjs,
  IconPnpm,
  IconPostgresql,
  IconTailwind,
  IconTurborepo,
  IconZod,
} from "@workspace/ui-patterns/stack-icons"

import { Tint } from "@/components/sections/tint"
import { GUTTER } from "@/config/layout"

const ITEMS: readonly {
  name: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}[] = [
  { name: "Next.js 16.4", Icon: IconNextjs },
  { name: "Turborepo", Icon: IconTurborepo },
  { name: "pnpm", Icon: IconPnpm },
  { name: "Tailwind CSS 4", Icon: IconTailwind },
  { name: "PostgreSQL", Icon: IconPostgresql },
  { name: "Zod", Icon: IconZod },
]

export function StripSection() {
  return (
    <section aria-label="Built with" className="relative border-b">
      <Tint className="bg-card" />
      <div
        className={`${GUTTER} grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6`}
      >
        {ITEMS.map(({ name, Icon }) => (
          <div
            key={name}
            className="flex h-48 flex-col items-center justify-center gap-4 border-r border-b last:border-r-0 max-lg:even:border-r-0 lg:border-b-0"
          >
            <Icon aria-hidden className="size-10" />
            <span className="text-sm font-medium">{name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

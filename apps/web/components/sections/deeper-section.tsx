import { PixelArt, type SpriteName } from "@workspace/ui-patterns/pixel-art"

import { Tint } from "@/components/sections/tint"
import { GUTTER } from "@/config/layout"
import { docsHref } from "@/config/site"

const CELLS: readonly {
  sprite: SpriteName
  title: string
  text: string
  href: string
}[] = [
  {
    sprite: "plug",
    title: "Providers",
    text: "The five stacks, their env variables and where data goes.",
    href: docsHref("providers.md"),
  },
  {
    sprite: "lock",
    title: "Authentication",
    text: "Sessions, the data access layer, roles and per-app cookies.",
    href: docsHref("authentication.md"),
  },
  {
    sprite: "palette",
    title: "Design system",
    text: "Tokens, type, spacing, the pixel art and how to update shadcn.",
    href: docsHref("design-system.md"),
  },
]

export function DeeperSection() {
  return (
    <section className="relative border-b">
      <Tint className="bg-secondary" />
      <div className="border-b py-16">
        <h2 className={`${GUTTER} px-9 text-4xl font-medium tracking-tight sm:text-5xl`}>
          Go deeper.
        </h2>
      </div>
      <div className={`${GUTTER} grid grid-cols-1 md:grid-cols-3`}>
        {CELLS.map((cell) => (
          <a
            key={cell.title}
            href={cell.href}
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-80 flex-col gap-6 border-b p-9 transition-colors last:border-b-0 hover:bg-card md:border-r md:border-b-0 md:last:border-r-0"
          >
            <PixelArt name={cell.sprite} size="sm" />
            <h3 className="mt-auto text-3xl font-medium tracking-tight">
              {cell.title}
            </h3>
            <p className="text-base text-muted-foreground">{cell.text}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

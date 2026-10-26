import {
  IconBrandNextjs,
  IconBrandPnpm,
  IconBrandReact,
  IconBrandSupabase,
  IconBrandTailwind,
  IconBrandTypescript,
} from "@tabler/icons-react"

import { Stagger } from "@/components/shared/stagger"

const STACK = [
  { name: "Next.js", Logo: IconBrandNextjs },
  { name: "React", Logo: IconBrandReact },
  { name: "TypeScript", Logo: IconBrandTypescript },
  { name: "Tailwind CSS", Logo: IconBrandTailwind },
  { name: "Supabase", Logo: IconBrandSupabase },
  { name: "pnpm", Logo: IconBrandPnpm },
] as const

/** Decorative stack overview for the auth rail: the real brand marks, each with its name. */
export function StackShowcase() {
  return (
    <Stagger className="flex flex-wrap gap-x-8 gap-y-6">
      {STACK.map(({ name, Logo }) => (
        <div key={name} className="flex flex-col items-start gap-2">
          <Logo aria-hidden className="size-10" />
          <span className="font-mono text-xs text-muted-foreground">
            {name}
          </span>
        </div>
      ))}
    </Stagger>
  )
}

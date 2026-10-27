import { StackGrid } from "@workspace/ui-patterns/stack-grid"

/** Decorative stack overview for the auth rail: clean bento grid of all 15 core technologies. */
export function StackShowcase() {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
        Engineered with
      </span>
      <StackGrid variant="compact" />
    </div>
  )
}

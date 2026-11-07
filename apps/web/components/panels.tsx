import { PixelField, type FieldTone } from "@workspace/ui-patterns/pixel-art"

/** Colored pixel wallpaper with one small mock-up on top. The mock-ups are static and carry no data. */
function Panel({
  tone,
  children,
}: {
  tone: FieldTone
  children: React.ReactNode
}) {
  return (
    <div
      aria-hidden
      className="relative flex min-h-80 items-center justify-center overflow-hidden p-4"
    >
      <PixelField tone={tone} />
      {children}
    </div>
  )
}

const PROVIDERS = [
  "neon-auth",
  "supabase",
  "keycloak",
  "fastapi-oauth",
  "demo",
] as const

export function StacksPanel() {
  return (
    <Panel tone="orange">
      <div className="relative flex w-3/5 min-w-56 flex-col divide-y border bg-card text-card-foreground">
        <div className="px-4 py-3 font-mono text-sm text-muted-foreground">
          AUTH_PROVIDER=
        </div>
        {PROVIDERS.map((value, i) => (
          <div
            key={value}
            className="flex items-center justify-between px-4 py-2.5 font-mono text-sm"
          >
            <span className={i === 0 ? "font-medium" : "text-muted-foreground"}>
              {value}
            </span>
            {i === 0 ? <span className="text-muted-foreground">default</span> : null}
          </div>
        ))}
      </div>
    </Panel>
  )
}

const TREE = [
  ["apps/", ""],
  ["  dashboard", "signed-in app"],
  ["  web", "landing page"],
  ["packages/", ""],
  ["  auth", "5 sign-in stacks"],
  ["  db", "Drizzle, Supabase SQL"],
  ["  ui", "shadcn, Animate UI"],
  ["  ui-patterns", "logo, pixel art"],
] as const

export function PackagesPanel() {
  return (
    <Panel tone="blue">
      <div className="relative w-4/5 min-w-72 bg-zinc-950 p-5 font-mono text-sm leading-relaxed whitespace-pre text-zinc-100">
        {TREE.map(([name, note]) => (
          <div key={name} className="flex gap-4">
            <span className="w-32 shrink-0">{name}</span>
            <span className="text-zinc-400 max-sm:hidden">{note}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

const SWATCHES = [
  ["background", "bg-background"],
  ["card", "bg-card"],
  ["secondary", "bg-secondary"],
  ["border", "bg-border"],
  ["primary", "bg-primary"],
  ["chart-1", "bg-chart-1"],
] as const

export function DesignPanel() {
  return (
    <Panel tone="green">
      <div className="relative grid w-3/5 min-w-64 grid-cols-3 gap-px border bg-border text-card-foreground">
        {SWATCHES.map(([name, swatch]) => (
          <div key={name} className="flex flex-col gap-3 bg-card p-3">
            <span className={`block h-12 border ${swatch}`} />
            <span className="font-mono text-sm">{name}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

const TASKS = [
  ["lint", "every package"],
  ["typecheck", "every package"],
  ["test", "packages with tests"],
  ["build", "both apps"],
] as const

export function ChecksPanel() {
  return (
    <Panel tone="yellow">
      <div className="relative flex w-3/5 min-w-56 flex-col divide-y border bg-card text-card-foreground">
        <div className="px-4 py-3 font-mono text-sm text-muted-foreground">
          pnpm check, pnpm build
        </div>
        {TASKS.map(([task, scope]) => (
          <div
            key={task}
            className="flex items-center justify-between px-4 py-2.5 font-mono text-sm"
          >
            <span className="font-medium">{task}</span>
            <span className="text-muted-foreground">{scope}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

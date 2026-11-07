import { cn } from "@workspace/ui/lib/utils"

/** Brand ramp = chart tokens: o orange, t tangerine, y yellow, r red, m muted, k ink (follows the theme). */
const FILL = {
  o: "fill-chart-1",
  t: "fill-chart-2",
  y: "fill-chart-3",
  r: "fill-chart-4",
  m: "fill-chart-5",
  k: "fill-foreground",
} as const

type Key = keyof typeof FILL

export const SPRITE_SIZE = 16

const E = "16."

/** Run-length rows: "3.4o2k" is 3 empty, 4 orange, 2 ink. Every row must add up to SPRITE_SIZE (tested). */
export const SPRITES = {
  /** Window with four panels: the dashboard. */
  dashboard: [
    E,
    "1.14m1.",
    "1.m12.m1.",
    "1.14m1.",
    "1.m12.m1.",
    "1.m.4o2.4t.m1.", "1.m.4o2.4t.m1.", "1.m.4o2.4t.m1.",
    "1.m12.m1.",
    "1.m.4y2.4r.m1.", "1.m.4y2.4r.m1.", "1.m.4y2.4r.m1.",
    "1.m12.m1.",
    "1.14m1.",
    E, E,
  ],
  /** `</>`: source code and the repository. */
  code: [
    E, E, E, E,
    "4.2o3.1y2t4.",
    "3.2o4.y.2t3.",
    "2.2o4.y3.2t2.",
    "1.2o5.y4.2t1.",
    "2.2o3.y4.2t2.",
    "3.2o2.y3.2t3.",
    "4.2oy3.2t4.",
    E, E, E, E, E,
  ],
  /** Open book: documentation. */
  book: [
    E, E, E,
    "1.6o2k6o1.",
    "1.o4y o2k o4y o1.".replace(/ /g, ""),
    "1.6o2k6o1.",
    "1.o4yo2ko4yo1.",
    "1.6o2k6o1.",
    "1.o4yo2ko4yo1.",
    "1.6o2k6o1.",
    "1.o4yo2ko4yo1.",
    "1.6o2k6o1.",
    "1.14t1.",
    E, E, E,
  ],
  /** Power plug: wiring a provider in. */
  plug: [
    E,
    "5.1m4.1m5.", "5.1m4.1m5.", "5.1m4.1m5.", "5.1m4.1m5.",
    "3.10o3.", "3.10o3.", "3.4o2y4o3.", "3.10o3.",
    "4.8t4.",
    "6.4t6.",
    "7.2m7.", "7.2m7.", "7.2m7.",
    E, E,
  ],
  /** Paint palette: the design system. */
  palette: [
    E,
    "5.6y5.",
    "3.10y3.",
    "2.12y2.",
    "2.y2o5y2r2y2.", "2.y2o5y2r2y2.",
    "2.12y2.",
    "2.4y2k3y2o1y2.", "2.4y2k3y2o1y2.",
    "2.4y3.5y2.",
    "3.3y3.4y3.",
    "5.6y5.",
    E, E, E, E,
  ],
  /** Padlock: sign-in and sessions. */
  lock: [
    E, E,
    "5.6m5.",
    "4.2m4.2m4.", "4.2m4.2m4.", "4.2m4.2m4.",
    "3.10o3.", "3.10o3.",
    "3.4o2k4o3.", "3.4o2k4o3.",
    "3.10o3.", "3.10o3.",
    "3.10t3.",
    E, E, E,
  ],
  /** Office building: an organization. */
  building: [
    E, E,
    "3.10o3.", "3.10o3.",
    "3.o2yo2yo2yo3.", "3.o2yo2yo2yo3.",
    "3.10o3.",
    "3.o2yo2yo2yo3.", "3.o2yo2yo2yo3.",
    "3.10o3.",
    "3.10o3.",
    "3.4o2k4o3.", "3.4o2k4o3.", "3.4o2k4o3.",
    E, E,
  ],
  /** Key: kept for the hero scene. */
  key: [
    E, E, E, E,
    "2.6o8.", "2.6o8.",
    "2.2o2.10t", "2.2o2.10t",
    "2.6o2.2y.2y.", "2.6o2.2y.2y.",
    E, E, E, E, E, E,
  ],
} as const satisfies Record<string, readonly string[]>

export type SpriteName = keyof typeof SPRITES

/** Splits one run-length row into painted runs and returns the row width. */
export function decodeRow(row: string) {
  const runs: { x: number; w: number; c: Key }[] = []
  let x = 0
  for (const [, n, c] of row.matchAll(/(\d*)(.)/g)) {
    const w = n ? Number(n) : 1
    if (c !== ".") runs.push({ x, w, c: c as Key })
    x += w
  }
  return { runs, width: x }
}

// 16 px grid: every size is a whole multiple (2, 4, 6, 8 px per pixel) so edges stay crisp.
const SIZE = {
  xs: "size-8",
  sm: "size-16",
  md: "size-24",
  lg: "size-32",
} as const

/** A pixel chevron (2px per pixel). Follows `currentColor`, so it takes the text color. */
export function PixelChevron({
  direction = "right",
  className,
}: {
  direction?: "right" | "down"
  className?: string
}) {
  const right = direction === "right"
  const cells = right
    ? [[0, 0], [1, 1], [2, 2], [3, 3], [2, 4], [1, 5], [0, 6]]
    : [[0, 0], [1, 1], [2, 2], [3, 3], [4, 2], [5, 1], [6, 0]]
  return (
    <svg
      viewBox={right ? "0 0 4 7" : "0 0 7 4"}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden
      className={cn("shrink-0 fill-current", right ? "h-3.5 w-2" : "h-2 w-3.5", className)}
    >
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />
      ))}
    </svg>
  )
}

/** Pixel illustration drawn as `<rect>` runs. Colors come from theme tokens, so it follows light and dark. */
export function PixelArt({
  name,
  size = "md",
  className,
}: {
  name: SpriteName
  size?: keyof typeof SIZE
  className?: string
}) {
  return (
    <svg
      viewBox={`0 0 ${SPRITE_SIZE} ${SPRITE_SIZE}`}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden
      className={cn("shrink-0", SIZE[size], className)}
    >
      {SPRITES[name].flatMap((row, y) =>
        decodeRow(row).runs.map(({ x, w, c }) => (
          <rect key={`${y}-${x}`} x={x} y={y} width={w} height={1} className={FILL[c]} />
        ))
      )}
    </svg>
  )
}

/** Card art: the sprite on a plate with a few loose squares and diamonds around it. Decorative only. */
export function PixelTile({
  name,
  className,
}: {
  name: SpriteName
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex h-48 items-center justify-center overflow-hidden border-b bg-muted",
        className
      )}
    >
      <span className="absolute top-6 left-8 size-3 bg-secondary" />
      <span className="absolute bottom-8 left-14 size-5 bg-secondary" />
      <span className="absolute top-10 right-12 size-4 rotate-45 bg-secondary" />
      <span className="absolute right-8 bottom-6 size-2 rotate-45 bg-border" />
      <span className="flex size-28 items-center justify-center border bg-secondary">
        <PixelArt name={name} size="md" />
      </span>
    </div>
  )
}

/**
 * Art palettes for `PixelField` panels. Fixed colors on purpose: they are illustrations, not UI, and read the
 * same in light and dark (the only place besides the sprites where color is not a theme token).
 */
const FIELD_TONES = {
  orange: ["#ff5a1f", "#ff6a33", "#ff7a47", "#f04a14"],
  yellow: ["#ffbf1a", "#ffca3d", "#ffd966", "#ffae00"],
  blue: ["#b9daff", "#a3cdfd", "#8fc1fb", "#55b3fb"],
  green: ["#94eacc", "#6cd2a7", "#a8f0d6", "#44ba82"],
} as const

export type FieldTone = keyof typeof FIELD_TONES

/** Deterministic pick (no Math.random, so server and client render the same cells). */
function cellColor(tone: FieldTone, x: number, y: number) {
  const palette = FIELD_TONES[tone]
  const h = ((x * 73856093) ^ (y * 19349663)) >>> 0
  // About half the cells keep the base color; the rest take one of the other three.
  return h % 2 === 0 ? palette[0] : palette[1 + (h % 3)]
}

/** A flat grid of tinted squares that fills its (relative) parent, like a pixel wallpaper. Decorative. */
export function PixelField({
  tone,
  cols = 14,
  rows = 8,
  className,
}: {
  tone: FieldTone
  cols?: number
  rows?: number
  className?: string
}) {
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="none"
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden
      className={cn("absolute inset-0 size-full", className)}
    >
      {Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => (
          <rect
            key={`${y}-${x}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={cellColor(tone, x, y)}
          />
        ))
      )}
    </svg>
  )
}

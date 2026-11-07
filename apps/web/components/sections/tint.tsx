/** Full-bleed band color that sits below the rails (`-z-20`, rails are `-z-10`), so the hairlines stay visible. */
export function Tint({ className }: { className: string }) {
  return <span aria-hidden className={`absolute inset-0 -z-20 ${className}`} />
}

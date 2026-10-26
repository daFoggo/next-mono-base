import { cn } from "@workspace/ui/lib/utils"

/** Header cell shared by every column (sidebar, main, right panel) so their hairlines line up (A1). */
export function ColumnHeader({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b px-4",
        className
      )}
    >
      {children}
    </div>
  )
}

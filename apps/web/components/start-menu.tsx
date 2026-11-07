"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  PixelArt,
  PixelChevron,
  type SpriteName,
} from "@workspace/ui-patterns/pixel-art"

export interface StartMenuItem {
  label: string
  href: string
  sprite: SpriteName
  external?: boolean
}

/** The header's last cell: a text trigger with a pixel caret that opens a panel of large link rows. */
export function StartMenu({
  label,
  groups,
}: {
  label: string
  groups: readonly (readonly StartMenuItem[])[]
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group/trigger flex h-full items-center gap-3 border-l px-5 text-base font-medium transition-colors outline-none hover:bg-accent data-popup-open:bg-accent">
        {label}
        <PixelChevron
          direction="down"
          className="motion-safe:transition-transform group-data-popup-open/trigger:rotate-180"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={0} className="w-72 rounded-2xl p-2">
        {groups.map((group, i) => (
          <div key={i}>
            {i > 0 ? <DropdownMenuSeparator className="my-2" /> : null}
            {group.map((item) => (
              <DropdownMenuItem
                key={item.label}
                className="h-14 gap-3 rounded-xl px-3 text-base font-medium"
                render={
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  />
                }
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary">
                  <PixelArt name={item.sprite} size="xs" />
                </span>
                {item.label}
                <PixelChevron className="ml-auto" />
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

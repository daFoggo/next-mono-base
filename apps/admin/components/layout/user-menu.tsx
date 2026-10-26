"use client"

import { useTransition } from "react"
import {
  IconDots,
  IconLogout,
  IconMoon,
  IconSun,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { SidebarMenuButton } from "@workspace/ui/components/sidebar"

import { signOutAction } from "@/features/auth/actions"

const ROLE_LABEL = {
  customer: "Customer",
  editor: "Editor",
  admin: "Admin",
} as const

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (
    ((parts.at(-2)?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase() || "?"
  )
}

/** Account row pinned to the sidebar bottom (A2): name, role, theme, sign out. */
export function UserMenu({
  name,
  role,
}: {
  name: string
  role: keyof typeof ROLE_LABEL
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const [pending, startTransition] = useTransition()
  const dark = resolvedTheme === "dark"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<SidebarMenuButton size="lg" tooltip={name} />}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials(name)}
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-medium text-foreground">
            {name}
          </span>
          <span className="text-xs text-muted-foreground">{ROLE_LABEL[role]}</span>
        </span>
        <IconDots aria-hidden className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuItem onClick={() => setTheme(dark ? "light" : "dark")}>
          {dark ? <IconSun aria-hidden /> : <IconMoon aria-hidden />}
          {dark ? "Light" : "Dark"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={pending}
          onClick={() => startTransition(() => signOutAction())}
        >
          <IconLogout aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

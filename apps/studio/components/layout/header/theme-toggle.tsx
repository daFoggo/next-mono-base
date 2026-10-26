"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"

import { useThemeToggle } from "@/hooks/use-theme-toggle"

// The icon that appears plays a short spin and zoom in. ThemeProvider disables CSS transitions
// while the theme flips, so this uses an animation: it restarts when `dark:` flips `display`.
const icon =
  "motion-safe:animate-in motion-safe:duration-300 motion-safe:ease-out motion-safe:fade-in motion-safe:zoom-in-50 motion-safe:spin-in-90"

/** Icon button that flips between light and dark. */
export function ThemeToggle({ className }: { className?: string }) {
  const toggleTheme = useThemeToggle()
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className={className}
    >
      <IconSun className={`${icon} dark:hidden`} />
      <IconMoon className={`${icon} hidden dark:block`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

"use client"

import { useTheme } from "next-themes"

import {
  ThemeTogglerButton,
  ThemeTogglerButtonIcon,
  type Resolved,
  type ThemeSelection,
} from "@workspace/ui/components/animate-ui/buttons/theme-toggler"
import { ThemeToggler } from "@workspace/ui/components/animate-ui/effects/theme-toggler"

/** Icon button that flips between light and dark with a View Transition wipe. Needs `ThemeProvider` above it. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const currentTheme = (theme ?? "light") as ThemeSelection
  const currentResolved = (resolvedTheme ?? "light") as Resolved

  return (
    <ThemeToggler
      theme={currentTheme}
      resolvedTheme={currentResolved}
      setTheme={setTheme}
    >
      {({ effective, resolved, toggleTheme }) => (
        <ThemeTogglerButton
          variant="ghost"
          size="icon-sm"
          modes={["light", "dark"]}
          theme={effective}
          resolvedTheme={resolved}
          setTheme={toggleTheme}
          aria-label="Toggle theme"
          className={className}
        >
          <ThemeTogglerButtonIcon />
          <span className="sr-only">Toggle theme</span>
        </ThemeTogglerButton>
      )}
    </ThemeToggler>
  )
}

"use client"

import { useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"

/**
 * Icon button that copies `value` (a string, or a function run at click time, e.g. the current
 * URL). The icon turns into a check for a moment; the swap zooms in, under `motion-safe`.
 */
export function CopyButton({
  value,
  label,
  icon: Icon = IconCopy,
}: {
  value: string | (() => string)
  label: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(
      typeof value === "function" ? value() : value
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={copy}>
      {copied ? (
        <IconCheck className="motion-safe:animate-in motion-safe:duration-200 motion-safe:zoom-in-50" />
      ) : (
        <Icon />
      )}
      <span className="sr-only">{copied ? "Copied" : label}</span>
    </Button>
  )
}

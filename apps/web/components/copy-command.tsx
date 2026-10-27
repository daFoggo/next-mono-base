"use client"

import { useState } from "react"
import { IconCheck, IconCopy, IconTerminal } from "@tabler/icons-react"

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/20 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-all duration-150 hover:border-border hover:bg-muted/40 hover:text-foreground active:translate-y-px"
    >
      <IconTerminal className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
      <span className="select-all text-foreground/90">{command}</span>
      <span className="ml-1 border-l border-border/40 pl-2">
        {copied ? (
          <span className="flex items-center gap-1 text-[11px] text-emerald-500">
            <IconCheck className="size-3" />
            <span>Copied</span>
          </span>
        ) : (
          <IconCopy className="size-3 transition-colors group-hover:text-foreground" />
        )}
      </span>
    </button>
  )
}

#!/usr/bin/env node
/**
 * pnpm verify:clean [--keep]
 *
 * Proves the clean state still works: copies the working tree (tracked and untracked, ignoring .gitignore'd files)
 * to a sibling folder, installs, runs scripts/clean-start.mjs, then `pnpm check` and `pnpm build`, and scans the
 * result for leftovers. The overlay files in scripts/clean/overlay are full copies, so this is what catches them
 * drifting from the files they replace. Run it after touching any file the clean script touches.
 */
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const KEEP = process.argv.includes("--keep")
// Same drive as the repo: pnpm hard-links from its store, which a cross-drive copy would turn into a full download.
const COPY = path.join(path.dirname(ROOT), `.clean-check-${path.basename(ROOT)}`)
const LEFTOVER = /features\/workspace|orgSlug|projectRef|getWorkspace|clean:start|demo:start|demo:end/
const TEXT = /\.(ts|tsx|md|mdx|yml|yaml|json|mjs|js)$/
const SKIP = new Set(["node_modules", ".next", ".git", ".turbo", ".vercel", "test-results"])

function sh(command, args, options = {}) {
  console.log(`\n> ${command} ${args.join(" ")}`)
  const result = spawnSync(command, args, {
    cwd: COPY,
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  })
  if (result.status !== 0) {
    console.error(`verify:clean: FAILED at \`${command} ${args.join(" ")}\` (copy kept at ${COPY})`)
    process.exit(1)
  }
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (TEXT.test(entry.name)) yield full
  }
}

fs.rmSync(COPY, { recursive: true, force: true })
const listed = spawnSync("git", ["ls-files", "-co", "--exclude-standard", "-z"], { cwd: ROOT, encoding: "utf8" })
if (listed.status !== 0) {
  console.error("verify:clean: needs a git repository")
  process.exit(1)
}
for (const rel of listed.stdout.split("\0").filter(Boolean)) {
  const from = path.join(ROOT, rel)
  if (!fs.existsSync(from)) continue // tracked but deleted in the working tree
  fs.mkdirSync(path.dirname(path.join(COPY, rel)), { recursive: true })
  fs.copyFileSync(from, path.join(COPY, rel))
}

sh("pnpm", ["install", "--frozen-lockfile", "--prefer-offline"])
sh("node", ["scripts/clean-start.mjs", "--force"])
sh("pnpm", ["check"])
// Like CI: `next build` must not need data or secrets.
sh("pnpm", ["build"], { env: { ...process.env, AUTH_PROVIDER: "neon-auth" } })

const leftovers = []
for (const file of walk(COPY)) {
  const rel = path.relative(COPY, file)
  if (rel.startsWith(path.join("docs", "superpowers"))) continue
  fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (LEFTOVER.test(line)) leftovers.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`)
    })
}
if (leftovers.length) {
  console.error(`\nverify:clean: leftovers of the demo in the clean copy (kept at ${COPY}):\n${leftovers.join("\n")}`)
  process.exit(1)
}

if (!KEEP) fs.rmSync(COPY, { recursive: true, force: true })
console.log("\nverify:clean: OK. The clean base installs, passes `pnpm check` and builds.")

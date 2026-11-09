#!/usr/bin/env node
/**
 * pnpm clean:start [--dry-run] [--force]
 *
 * Turns the base into an empty app: removes the sample features, then keeps the docs that explain how to build
 * your own. Three mechanisms, in this order:
 *   1. DELETE   paths that exist only for the demo.
 *   2. OVERLAY  files in scripts/clean/overlay/ replace the file at the same path (clean versions of shared files).
 *   3. MARKERS  any line from one containing `demo:start` to one containing `demo:end` is removed, in every text file
 *               (a `//` comment, an HTML comment or a JSX comment holding it); a same-line pair is removed too.
 * Then it drops the sample tables with a generated migration, deletes build caches (their typed routes would point at
 * deleted pages) and removes itself. `--dry-run` only prints the plan and checks it still matches the repo.
 */
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const OVERLAY = path.join(ROOT, "scripts", "clean", "overlay")
const args = new Set(process.argv.slice(2))
const DRY = args.has("--dry-run")
const FORCE = args.has("--force")

const DELETE = [
  "apps/dashboard/features/workspace",
  "apps/dashboard/app/(dashboard)/org",
  "apps/dashboard/app/(dashboard)/project",
  "apps/dashboard/app/(dashboard)/dashboard/organizations",
  "apps/dashboard/app/(dashboard)/dashboard/_components",
  "apps/dashboard/e2e/neon.spec.ts",
]
const SELF = ["scripts/clean", "scripts/clean-start.mjs", "scripts/verify-clean.mjs"]
const ROOT_SCRIPTS = ["clean:start", "clean:start:check", "verify:clean"]
const TEXT = /\.(ts|tsx|md|mdx|yml|yaml|json|mjs|js)$/
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", ".turbo", ".vercel", "test-results", "scripts"])

const abs = (rel) => path.join(ROOT, rel)
const fail = (message) => {
  console.error(`clean:start: ${message}`)
  process.exit(1)
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name))
    } else if (TEXT.test(entry.name)) {
      yield path.join(dir, entry.name)
    }
  }
}

function* walkAll(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walkAll(full)
    else yield full
  }
}

/** Text with every demo block removed; throws on an unbalanced marker. */
function strip(text, file = "text") {
  const eol = text.includes("\r\n") ? "\r\n" : "\n"
  const inline = text.replace(/<!-- demo:start -->[^\n]*?<!-- demo:end -->/g, "")
  const out = []
  let open = 0
  for (const line of inline.split(/\r?\n/)) {
    if (line.includes("demo:start")) {
      if (open) throw new Error(`${file}: nested demo:start`)
      open = 1
    } else if (line.includes("demo:end")) {
      if (!open) throw new Error(`${file}: demo:end without demo:start`)
      open = 0
    } else if (!open) {
      out.push(line)
    }
  }
  if (open) throw new Error(`${file}: demo:start without demo:end`)
  const joined = out.join(eol)
  return file.endsWith(".md") ? joined.replace(/(\r?\n){3,}/g, eol + eol) : joined
}

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { cwd: ROOT, stdio: "inherit", shell: process.platform === "win32" })
  if (result.status !== 0) fail(`\`${command} ${commandArgs.join(" ")}\` failed`)
}

// Already clean: nothing left to do.
if (!fs.existsSync(abs("scripts/clean"))) {
  console.log("clean:start: nothing to do (scripts/clean is gone, the base is already clean).")
  process.exit(0)
}

// 1. The plan, checked against the repo.
const missing = []
const deletes = DELETE.filter((rel) => {
  if (fs.existsSync(abs(rel))) return true
  missing.push(rel)
  return false
})
const overlays = [...walkAll(OVERLAY)].map((file) => path.relative(OVERLAY, file).split(path.sep).join("/"))
const stale = overlays.filter((rel) => !fs.existsSync(abs(rel)))
const marked = []
for (const file of walk(ROOT)) {
  const text = fs.readFileSync(file, "utf8")
  if (!text.includes("demo:start") && !text.includes("demo:end")) continue
  try {
    strip(text, file)
  } catch (error) {
    fail(error.message)
  }
  marked.push(path.relative(ROOT, file).split(path.sep).join("/"))
}

console.log(`delete  ${deletes.length} path(s)\n${deletes.map((d) => `  - ${d}`).join("\n")}`)
console.log(`overlay ${overlays.length} file(s)\n${overlays.map((d) => `  - ${d}`).join("\n")}`)
console.log(`markers ${marked.length} file(s)\n${marked.map((d) => `  - ${d}`).join("\n")}`)
if (stale.length) fail(`overlay files with no target in the repo (renamed or deleted?): ${stale.join(", ")}`)
if (DRY) {
  if (missing.length) console.log(`note: already removed: ${missing.join(", ")}`)
  console.log("clean:start: dry run, nothing changed.")
  process.exit(0)
}

// 2. Guard: a clean git tree, so `git checkout . && git clean -fd` undoes everything.
if (!FORCE) {
  const git = spawnSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8" })
  if (git.status !== 0) fail("not a git repository; pass --force to run anyway.")
  if (git.stdout.trim()) fail("the working tree has changes; commit or stash them first (or pass --force).")
}

// 3. Apply.
for (const rel of deletes) fs.rmSync(abs(rel), { recursive: true, force: true })
for (const rel of overlays) fs.copyFileSync(path.join(OVERLAY, rel), abs(rel))
for (const rel of marked) {
  const text = fs.readFileSync(abs(rel), "utf8")
  fs.writeFileSync(abs(rel), strip(text, rel))
}

const pkgPath = abs("package.json")
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
for (const name of ROOT_SCRIPTS) delete pkg.scripts?.[name]
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

// The sample tables leave the schema, so the migration history needs a drop (no database connection needed).
if (fs.existsSync(abs("packages/db/neon/migrations"))) {
  run("pnpm", ["--filter", "@workspace/db", "exec", "drizzle-kit", "generate", "--name", "drop_sample_tables"])
}

// Typed routes in build caches still name the deleted pages.
for (const app of ["dashboard", "web"]) fs.rmSync(abs(`apps/${app}/.next`), { recursive: true, force: true })

for (const rel of SELF) fs.rmSync(abs(rel), { recursive: true, force: true })
if (fs.existsSync(abs("scripts")) && fs.readdirSync(abs("scripts")).length === 0) fs.rmdirSync(abs("scripts"))

console.log("\nclean:start: done. Next: pnpm check && pnpm build, then read docs/adding-a-feature.md.")

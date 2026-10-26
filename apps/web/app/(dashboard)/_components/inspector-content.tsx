import { requirePermission } from "@/lib/dal"

/** Inspector body: context for the current page. Replace with your own blocks. */
export async function InspectorContent() {
  const session = await requirePermission("account:view")
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
        Session
      </h3>
      <p className="text-muted-foreground">Signed in as {session.email}.</p>
    </section>
  )
}

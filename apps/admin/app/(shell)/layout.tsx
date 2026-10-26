import { Suspense } from "react"

import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

import { visibleSections } from "@/config/navigation"
import { AdminBreadcrumb } from "@/components/layout/admin-breadcrumb"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { ColumnHeader } from "@/components/layout/column-header"
import { MenuButton } from "@/components/layout/menu-button"
import { UserMenu } from "@/components/layout/user-menu"
import { getSession } from "@/lib/dal"

/** The sidebar needs the session (role decides the sections); pages still authorize themselves. */
async function SessionSidebar() {
  const session = await getSession()
  if (!session) return null
  return (
    <AdminSidebar
      sections={visibleSections(session.role)}
      account={
        <UserMenu
          name={session.name ?? session.email ?? "Staff"}
          role={session.role}
        />
      }
    />
  )
}

/** Three-column shell (docs/design-system.md A1): sidebar · main (· right panel, added by pages that need it). */
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Suspense>
        <SessionSidebar />
      </Suspense>
      <SidebarInset className="min-w-0">
        <ColumnHeader className="sticky top-0 z-10 bg-background">
          <MenuButton />
          {/* A dynamic route reads the pathname at request time. */}
          <Suspense>
            <AdminBreadcrumb />
          </Suspense>
        </ColumnHeader>
        <div className="flex w-full max-w-6xl flex-col gap-8 px-4 pt-8 pb-28 sm:px-8 sm:pb-14">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

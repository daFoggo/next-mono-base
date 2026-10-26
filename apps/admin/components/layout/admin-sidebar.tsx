"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar"

import type { NavSection } from "@/config/navigation"
import { AppLogo } from "@/components/shared/app-logo"

import { NAV_ICONS } from "./nav-icons"

function isCurrent(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`)
}

/** Sectioned sidebar (A1, A2): icon rail on desktop, left Sheet below `md`. */
export function AdminSidebar({
  sections,
  account,
}: {
  sections: NavSection[]
  account: React.ReactNode
}) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b px-4 group-data-[collapsible=icon]:px-2">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Next Mono Base, Dashboard"
        >
          <span className="group-data-[collapsible=icon]:hidden">
            <AppLogo size="sm" />
          </span>
          <span className="hidden text-base font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:inline">
            K
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="no-scrollbar gap-2 py-2">
        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {section.title}
            </SidebarGroupLabel>
            <SidebarMenu>
              {section.links.map((link) => {
                const Icon = NAV_ICONS[link.icon]
                const current = isCurrent(pathname, link.href)
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      size={isMobile ? "lg" : "default"}
                      isActive={current}
                      tooltip={link.title}
                      render={
                        <Link
                          href={link.href}
                          aria-current={current ? "page" : undefined}
                          onClick={() => setOpenMobile(false)}
                        />
                      }
                    >
                      <Icon aria-hidden />
                      <span>{link.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t">{account}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

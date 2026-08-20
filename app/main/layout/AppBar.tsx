"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ClipboardList, FolderKanban, LayoutDashboard, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function AppSidebar() {
  const pathname = usePathname()

  const content = [
    {
      title: "Dashboard",
      link: "/main/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Project",
      link: "/main/project",
      icon: FolderKanban,
    },
    {
      title: "Board",
      link: "/main/board",
      icon: ClipboardList,
    },
    {
      title: "Teams",
      link: "/main/teams",
      icon: Users,
    },
  ]

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar/90 backdrop-blur-xl">
      {/* Sidebar Top Branding Area */}
      <SidebarHeader className="flex h-16 items-center border-b border-sidebar-border px-5">
        <div className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-primary p-1.5 text-primary-foreground shadow-[0_8px_20px_rgba(79,70,229,0.25)]">
            <img src="/main.png" alt="Workspace logo" className="h-full w-full object-contain"/>
          </div>
          <div><span className="block text-sm font-bold">TaskFlow</span><span className="block text-[10px] font-medium text-muted-foreground">Team workspace</span></div>
        </div>
      </SidebarHeader>

      {/* Main Navigation links */}
      <SidebarContent className="px-3 py-5">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-1">
            {content.map((item, idx) => {
              // Exact or logical parent routing match validation
              const isActive = pathname === item.link || pathname?.startsWith(`${item.link}/`)
              const Icon = item.icon

              return (
                <SidebarMenuItem key={idx}>
                  <SidebarMenuButton
                  
                    isActive={isActive}
                    className={`group w-full rounded-xl px-4 py-5.5 text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-primary text-primary-foreground shadow-[0_8px_22px_rgba(79,70,229,0.22)] hover:bg-primary hover:text-primary-foreground" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <Link href={item.link} className="flex items-center gap-3.5 w-full">
                      <Icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105
                        ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} 
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom Footer Section placeholder */}
      <SidebarFooter className="border-t border-sidebar-border bg-muted/20 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/60 px-3 py-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Systems Operational</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

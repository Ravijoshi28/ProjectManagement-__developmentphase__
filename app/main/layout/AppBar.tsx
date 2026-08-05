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
import { ClipboardList, FolderKanban, LayoutDashboard, Users, Sparkles } from "lucide-react"
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
    <Sidebar className="border-r border-muted bg-card">
      {/* Sidebar Top Branding Area */}
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-muted">
        <div className="flex items-center gap-2.5 font-semibold text-foreground tracking-tight">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <img src="/main.png" alt=""/>
          </div>
          <span className="text-sm font-bold">Workspace App</span>
        </div>
      </SidebarHeader>

      {/* Main Navigation links */}
      <SidebarContent className="px-3 py-4">
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
                    className={`w-full transition-all duration-200 rounded-xl px-4 py-5.5 text-sm font-medium group
                      ${isActive 
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground" 
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
      <SidebarFooter className="p-4 border-t border-muted bg-muted/20">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Systems Operational</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
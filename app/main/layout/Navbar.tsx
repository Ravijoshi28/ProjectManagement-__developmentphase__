"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Bell, User, Shield } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useUserState } from "@/app/zustand/userState"
import { socket } from "@/app/lib/socket"

export default function Navbar() {
  const { user } = useUserState()
  const queryClient = useQueryClient()
  const pathname = usePathname()

  // Prefer role check on user object rather than client env check
  const isAdmin =  user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  // Register user socket
  useEffect(() => {
    if (user) {
      socket.emit("register-user", user)
    }
  }, [user])

  // Real-time notifications refetching
  useEffect(() => {
    const handleNotification = () => {
      queryClient.refetchQueries({ queryKey: ["Notifications"] })
    }

    socket.on("notification", handleNotification)
    return () => {
      socket.off("notification", handleNotification)
    }
  }, [queryClient])

  // Format breadcrumbs dynamically
  const current = pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ")

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-white/70 bg-white/75 px-4 shadow-[0_1px_0_rgba(30,25,60,0.04)] backdrop-blur-xl transition-all sm:px-6">
      {/* Left side: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 rounded-xl border-border/70 bg-white/70 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent" />
        <div className="hidden h-4 w-px bg-muted sm:block" />
        <span className="hidden rounded-full border border-border/60 bg-white/60 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:inline-block">
          Workspace / {current || "Home"}
        </span>
      </div>

      {/* Center/Admin side */}
      {isAdmin && (
        <Button variant="outline" size="sm" className="rounded-full bg-white/70 shadow-sm">
          <Link href="/main/adminDashboard" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin Panel</span>
          </Link>
        </Button>
      )}

      {/* Right side: Action Triggers */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground" >
          <Link href="/main/notification" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Link>
        </Button>

        {/* Account Settings */}
        <Button variant="outline" size="sm" className="gap-2 rounded-full bg-white/70 text-xs shadow-sm" >
          <Link href="/main/profile">
            
            <span className="flex items-center gap-2"><User className="h-3.5 w-3.5 text-muted-foreground" /><span className="hidden sm:inline">Account Settings</span></span>
          </Link>
        </Button>
      </div>
    </header>
  )
}

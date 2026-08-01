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
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-muted bg-card/50 px-6 backdrop-blur-sm transition-all">
      {/* Left side: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 rounded-lg border hover:bg-muted transition-colors" />
        <div className="hidden h-4 w-px bg-muted sm:block" />
        <span className="hidden rounded-md bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-block">
          Workspace / {current || "Home"}
        </span>
      </div>

      {/* Center/Admin side */}
      {isAdmin && (
        <Button variant="outline" size="sm" >
          <Link href="/main/adminDashboard" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin Panel</span>
          </Link>
        </Button>
      )}

      {/* Right side: Action Triggers */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground" >
          <Link href="/main/notification" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Link>
        </Button>

        {/* Account Settings */}
        <Button variant="outline" size="sm" className="gap-2 text-xs" >
          <Link href="/main/profile">
            
            <span className="flex"><User className="h-3.5 w-3.5 text-muted-foreground" />Account Settings</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
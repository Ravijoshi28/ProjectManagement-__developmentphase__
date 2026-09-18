"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, User, Shield } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUserState } from "@/app/zustand/userState";
import { socket } from "@/app/lib/socket";

export default function Navbar() {
  const { user } = useUserState();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  // Prefer role check on user object rather than client env check
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  // Register user socket
  useEffect(() => {
    if (user) {
      socket.emit("register-user", user);
    }
  }, [user]);

  // Real-time notifications refetching
  useEffect(() => {
    const handleNotification = () => {
      queryClient.refetchQueries({ queryKey: ["Notifications"] });
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [queryClient]);

  // Format breadcrumbs dynamically
  const section = pathname.split("/").filter(Boolean)[1];
  const current =
    (
      {
        dashboard: "Dashboard",
        project: "Projects",
        board: "My tasks",
        teams: "Teams",
        profile: "Account settings",
        notification: "Notifications",
        adminDashboard: "Administration",
      } as Record<string, string>
    )[section] || "Workspace";

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-border bg-card px-4  sm:px-6">
      {/* Left side: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 rounded-xl border-border/70 bg-white/70 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent" />
        <div className="hidden h-4 w-px bg-muted sm:block" />
        <span className="hidden px-1 py-1.5 text-xs font-medium text-muted-foreground sm:inline-block">
          Workspace / {current || "Home"}
        </span>
      </div>

      {/* Center/Admin side */}
      {isAdmin && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-white/70 shadow-sm"
        >
          <Link href="/main/adminDashboard" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin Panel</span>
          </Link>
        </Button>
      )}

      {/* Right side: Action Triggers */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <Link
          href="/main/notification"
          aria-label="Notifications"
          className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
        </Link>

        {/* Account Settings */}
        <Link
          href="/main/profile"
          aria-label="Account settings"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-medium hover:bg-muted"
        >
          <User className="size-4 text-muted-foreground" />
          <span className="hidden sm:inline">Account settings</span>
        </Link>
      </div>
    </header>
  );
}

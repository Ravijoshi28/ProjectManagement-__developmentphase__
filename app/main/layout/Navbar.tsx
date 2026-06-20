"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Settings, User2Icon, LogOut, ChevronDown, User } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button" // Replaced base-ui with your local shadcn button
import { useUserState } from "@/app/zustand/userState"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
import { socket } from "@/app/lib/socket"
import { useNotification } from "@/app/zustand/useNotification"
import { useQueryClient } from "@tanstack/react-query"


export default function Navbar() {

  const {user}=useUserState();
  const {addNotification}=useNotification()
  const clientquery=useQueryClient()
  useEffect(()=>{
      if (user) {
    socket.emit("register-user", user);
    console.log(user);
  }
  },[user])
const queryClient=useQueryClient();
  
   useEffect(()=>{
    const refetch=async()=>{
      console.log("rached");
      await queryClient.refetchQueries({
        queryKey:["Notifications"]
      })
    }

     socket.on("notification",refetch);

     return ()=>{
      socket.off("notification",refetch);
     }
},[])

 

  const pathname = usePathname();

const current = pathname
  .split("/")
  .filter(Boolean)
  .map(
    (part) =>
      part.charAt(0).toUpperCase() +
      part.slice(1)
  )
  .join(" / ");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-muted bg-card/50 backdrop-blur-sm sticky top-0 z-50 transition-all w-full">
      {/* Left side: Sidebar Toggle & breadcrumb indicator */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 hover:bg-muted rounded-lg transition-colors border" />
        <div className="h-4 w-px bg-muted hidden sm:block" />
        <span className="text-xs font-medium text-muted-foreground hidden sm:inline-block bg-muted/50 px-2.5 py-1 rounded-md">
         Workspace / {current}
        </span>
      </div>

      {/* Right side: Action Triggers & Dropdowns */}
      <div className="flex items-center gap-4">
        {/* Quick notification bell dot icon */}
        <Link href="/main/notification">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg relative text-muted-foreground hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>
        </Link>
        {/* Account settings popover menu */}
        
   <Link href="/main/profile" className="w-full block"> 
      <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-20 hover:text-amber-900 border border-transparent hover:border-amber-200/50 transition-all duration-150 active:scale-[0.98]">
        <User size={14} className="text-slate-400 group-hover:text-amber-700" />
        <span>Account Settings</span>
      </button>
    </Link>
      
    
  
      </div>
    </header>
  )
}
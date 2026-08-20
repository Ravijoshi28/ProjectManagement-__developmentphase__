// app/main/layout.tsx (or whichever layout file this is)
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "./AppBar"; // Your sidebar component
import Navbar from "./Navbar";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-transparent">
        {/* The Sidebar component lives on the left */}
        <AppSidebar />

        {/* Main application container on the right */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar containing the SidebarTrigger */}
          <Navbar />
          
          {/* Main scrollable page content container */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

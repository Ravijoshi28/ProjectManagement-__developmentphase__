import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppBar"; 
import Navbar from "./Navbar";
import { getAuthenticatedUserId } from "@/app/lib/server/authenticatedUser";
import { users } from "@/app/Models/User";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const userId = await getAuthenticatedUserId();
  const currentUser = adminEmail && userId
    ? await users.findOne({ _id: userId })
    : null;
  const isAdmin = Boolean(adminEmail && currentUser?.email === adminEmail);

  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden bg-transparent">
        {/* The Sidebar component lives on the left */}
        <AppSidebar />

        {/* Main application container on the right */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Top Navbar containing the SidebarTrigger */}
          <Navbar isAdmin={isAdmin} />

          {/* Main scrollable page content container */}
          <main className="flex-1 overflow-y-auto bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

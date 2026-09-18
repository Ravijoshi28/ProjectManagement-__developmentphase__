import Layout from "./layout/Layout"; // This is your SidebarProvider layout wrapper
import Providers from "../provider";
import Footer from "./footer/page";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-transparent">
      {/* Wrap both the layout UI and the children together. 
        Now the sidebar, navbar, and page content all sit inside the SidebarProvider safely!
      */}
      <Layout>
        <div className="min-w-0">
          {/* Main content viewport */}
          <div className="min-h-[calc(100dvh-4rem)]">
            <Providers>{children}</Providers>
          </div>

          {/* Cleaned up and polished footer element */}
          <Footer />
        </div>
      </Layout>
    </div>
  );
}

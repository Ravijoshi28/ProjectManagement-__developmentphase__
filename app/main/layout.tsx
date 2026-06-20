

import Layout from "./layout/Layout"; // This is your SidebarProvider layout wrapper
import Providers from "../provider";
import Footer from "./footer/page";


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      {/* Wrap both the layout UI and the children together. 
        Now the sidebar, navbar, and page content all sit inside the SidebarProvider safely!
      */}
      <Layout>
        <div>
          {/* Main content viewport */}
          <div >
            <Providers>
            {children}
            </Providers>
          </div>

          {/* Cleaned up and polished footer element */}
          <footer >
           <Footer/>
          </footer>
        </div>
      </Layout>
    </div>
  );
}
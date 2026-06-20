import { MessageCircle, Users, Sparkles } from "lucide-react";
import Groups from "./groups";

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div className="flex h-150 overflow-hidden bg-slate-50">
      
      {/* Sidebar */}
      <div className="w-[320px] border-r border-slate-200 bg-white shadow-sm">
        <Groups />
      </div>

      {/* Main Content */}
    {children?(children):(<div className="flex-1 overflow-y-auto p-8">
  <div className="flex min-h-full items-center justify-center">
    
    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-sm p-10">
          
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm">
              <MessageCircle size={38} />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Welcome to Team Chat
            </h1>

            <p className="mt-3 text-slate-500 leading-relaxed">
              Select a group from the sidebar to start chatting,
              collaborate with your teammates, and manage discussions
              in real time.
            </p>
          </div>

          {/* Features */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <Users size={22} className="text-slate-700" />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                Team Groups
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Organize conversations by projects and teams.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <MessageCircle size={22} className="text-slate-700" />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                Real-time Chat
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Send instant updates and collaborate faster.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <Sparkles size={22} className="text-slate-700" />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                Smart Workspace
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Keep communication clean and productive.
              </p>
            </div>

          </div>

        </div>
        </div>

      </div>)}
    </div>
  );
}
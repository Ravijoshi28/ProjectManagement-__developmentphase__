
import Login from "./login/login";
import Signup from "./signup/signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function Auth() {
  
  return (
    <div className="min-h-screen min-w-150 bg-neutral-950 relative overflow-hidden flex items-center justify-center px-4 select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] p-8 sm:p-10">
        
        {/* Heading Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            LinkShortener
          </h1>
          <p className="text-sm text-neutral-400 font-medium">
            Securely manage and shorten your links
          </p>
        </div>

        {/* Tabs Control */}
        <Tabs defaultValue="signup" className="min-w-100">
          <TabsList className="grid grid-cols-2 w-full bg-neutral-900/80 border border-white/5 rounded-2xl h-12 p-1 backdrop-blur-md">
            <TabsTrigger
              value="login"
              className="rounded-xl text-sm font-semibold text-neutral-400 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-xl text-sm font-semibold text-neutral-400 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-lg transition-all duration-300"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Content Panel */}
          <TabsContent
            value="login"
            className="mt-6 focus-visible:outline-none animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
          >
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md">
              <Login />
            </div>
          </TabsContent>

          {/* Signup Content Panel */}
          <TabsContent
            value="signup"
            className="mt-6 focus-visible:outline-none animate-in fade-in-50 slide-in-from-bottom-4 duration-300"
          >
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md">
              <Signup />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
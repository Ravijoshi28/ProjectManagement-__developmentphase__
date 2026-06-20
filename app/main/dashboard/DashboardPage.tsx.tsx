"use client";

import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TaskOverview, { Three, Two } from "./TaskOverview";
import { useUserState } from "@/app/zustand/userState";

export default function Dashboard() {
  const { user } = useUserState();
  const [isMobile, setIsMobile] = useState(false);

  // Safely window-watch device breaks to intelligently swap resizable regions for standard stacks on mobile
  useEffect(() => {
    const checkMobileWidth = () => {
      setIsMobile(window.innerWidth < 768); // target standard tailwind 'md' break logic
    };

    checkMobileWidth();
    window.addEventListener("resize", checkMobileWidth);
    return () => window.removeEventListener("resize", checkMobileWidth);
  }, []);

  // Isolate name resolution safely or fallback to elegant guest context
  const displayName = user?.name || "Back";

  return (
    <div className="flex min-h-screen w-full flex-col p-4 sm:p-6 md:p-8 gap-6 bg-slate-50/40 font-sans">
      {/* Premium Dashboard Structural Header Block */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Welcome Back, {displayName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Here is what is happening across your personal workspaces today.
        </p>
      </div>

      <hr className="border-slate-200/80 w-full" />

      {/* Dynamic Main Layout Canvas Workspace Viewport */}
      <div className="w-full flex-1 min-h-[calc(100vh-200px)]">
        {isMobile ? (
          /* Mobile Layout Architecture Stack Element Blocks */
          <div className="flex flex-col gap-4 w-full">
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
              <TaskOverview />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
              <Two />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
              <Three />
            </div>
          </div>
        ) : (
          /* High-Fidelity Desktop Resizable Canvas Configuration Panels */
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full rounded-xl border border-slate-200/80 shadow-sm bg-white min-h-[650px]"
          >
            {/* Left Side: Macro Metrics Task Engine Component Canvas */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <div className="h-full p-4 overflow-y-auto scrollbar-thin">
                <TaskOverview />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-slate-200 hover:bg-slate-300 transition-colors w-1" />

            {/* Right Side: Split Tier Analytical Dynamic Widgets Panels */}
            <ResizablePanel defaultSize={55} minSize={40}>
              <ResizablePanelGroup orientation="vertical">
                {/* Secondary Slot Analytics Block */}
                <ResizablePanel defaultSize={50} minSize={25}>
                  <div className="h-full p-6 flex items-center justify-center overflow-y-auto border-b border-slate-100">
                    <div className="w-full h-full">
                      <Two />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-slate-200 hover:bg-slate-300 transition-colors h-1" />

                {/* Tertiary Slot Overview Queue Activity List */}
                <ResizablePanel defaultSize={50} minSize={25}>
                  <div className="h-full p-6 flex items-center justify-center overflow-y-auto">
                    <div className="w-full h-full">
                      <Three />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
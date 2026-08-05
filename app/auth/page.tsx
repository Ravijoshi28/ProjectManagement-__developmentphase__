"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  LayoutGrid,
  Shield,
  Users2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 relative overflow-hidden selection:bg-slate-900 selection:text-white">
      {/* Soft Light Mode Ambient Gradient */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-slate-200/60 via-slate-100/30 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-md shadow-slate-900/10">
            <img src="/main.png" alt="" />
            </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Project Management
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl font-medium"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-semibold shadow-md shadow-slate-900/10 px-5">
              Get Started Free
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm mb-8 text-xs font-semibold text-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-slate-500" />
          <span>Streamline your workspace with intelligent workflows</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
          Manage projects with clarity and velocity.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          TaskFlow gives your team an intuitive hub to plan tasks, track progress in real time, and deliver projects on schedule.
        </p>

        {/* Interactive Quick Task Input */}
        <div className="mt-10 max-w-xl mx-auto p-2 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Create a new task..."
            className="h-12 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4"
          />
          <Link href="/auth?tab=signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-12 px-6 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              Start Building <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        {/* Social Proof Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-slate-700" /> Free 14-day trial
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-slate-700" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-slate-700" /> Unlimited team members
          </span>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-28 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="p-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <LayoutGrid size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Flexible Kanban Boards</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visualize workflows with drag-and-drop boards, custom columns, and priority tags.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Users2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Real-Time Collaboration</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Assign tasks, leave inline comments, and keep team alignment without endless emails.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Timeline & Milestones</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Set deadlines, track sprint velocity, and spot bottlenecks before they impact delivery.
            </p>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Project Management Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, ClockIcon, Activity, Flame, ShieldAlert } from "lucide-react";

// Production Clean Mock Data Configurations
const RECENT_ACTIVITIES = [
  { id: 1, name: "Arjun Sharma", task: "Updated the database schema constraints", time: "10m ago", fallback: "AS", bg: "bg-blue-100 text-blue-700" },
  { id: 2, name: "Priya Patel", task: "Fixed the responsive navigation drawer alignment", time: "1h ago", fallback: "PP", bg: "bg-emerald-100 text-emerald-700" },
  { id: 3, name: "Kabir Singh", task: "Reviewed pull request #42 styling guidelines", time: "3h ago", fallback: "KS", bg: "bg-purple-100 text-purple-700" },
];

const MY_DEADLINES_DATA = [
  { id: 1, title: "Database Architecture Setup", deadline: "In 2 hours", date: "2026-05-24", urgent: true },
  { id: 2, title: "Client Feedback Implementation", deadline: "Tomorrow", date: "2026-05-25", urgent: false },
];

const TEAM_DEADLINES_DATA = [
  { id: 1, title: "API Authentication Deployment", deadline: "In 4 hours", date: "2026-05-24", urgent: true },
  { id: 2, title: "Staging Pipeline Regression Testing", deadline: "Next Week", date: "2026-06-01", urgent: false },
  { id: 3, title: "Core Architecture Audit Framework", deadline: "Next Week", date: "2026-06-02", urgent: false },
];

// 1. RECENT ACTIVITY COMPONENT
export default function TaskOverview() {
  return (
    <div className="w-full h-full flex flex-col justify-between font-sans">
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Activity size={18} className="text-slate-500" />
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Recent Activity</h2>
        </div>
        
        <div className="space-y-3">
          {RECENT_ACTIVITIES.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-3.5 p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-slate-200 transition-all duration-150"
            >
              <Avatar className="h-8 w-8 ring-1 ring-slate-100">
                <AvatarFallback className={`text-[11px] font-bold ${activity.bg}`}>
                  {activity.fallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900 truncate">{activity.name}</p>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">{activity.time}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">
                  {activity.task}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. REUSABLE DEADLINE DYNAMIC LIST WRAPPER
interface DeadlineItem {
  id: number;
  title: string;
  date: string;
  deadline: string;
  urgent: boolean;
}

function DeadlineList({ data }: { data: DeadlineItem[] }) {
  return (
    <div className="space-y-3 w-full">
      {data.map((item) => (
        <div 
          key={item.id} 
          className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-white hover:border-slate-300 shadow-sm transition-all duration-150 gap-4"
        >
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 tracking-tight truncate">
              {item.title}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
              <CalendarIcon className="h-3 w-3 shrink-0" />
              <span>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          
          <div 
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide shrink-0 border
              ${item.urgent 
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-amber-50 text-amber-700 border-amber-100"
              }`}
          >
            <ClockIcon className="h-3 w-3 shrink-0" />
            <span className="uppercase">{item.deadline}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// 3. DEADLINE WRAPPERS (Two and Three)
export function Two() {
  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} className="text-amber-500" />
        <h2 className="text-base font-bold tracking-tight text-slate-900">My Upcoming Deadlines</h2>
      </div>
      <DeadlineList data={MY_DEADLINES_DATA} />
    </div>
  );
}

export function Three() {
  return (
    <div className="w-full h-full flex flex-col font-sans">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={18} className="text-blue-500" />
        <h2 className="text-base font-bold tracking-tight text-slate-900">Team Upcoming Deadlines</h2>
      </div>
      <DeadlineList data={TEAM_DEADLINES_DATA} />
    </div>
  );
}
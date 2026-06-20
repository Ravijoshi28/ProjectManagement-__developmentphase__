"use client"

import { getProject } from "@/app/frontendLib/projectlib/projectapi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import Link from "next/link";

interface Project{
  name:string,
  about:string,
  _id:string,
  ownerId:string,
  image:string |null
}

export default function Groups() {
  const {data:projects=[],isLoading,
    error}=useQuery<Project[]>({queryKey:["project"],
      queryFn:getProject,
      staleTime:5*60*1000
    })
  const groups = [
    { name: "group1", pic: <User size={18} /> },
    { name: "group2", pic: <User size={18} /> },
    { name: "group3", pic: <User size={18} /> },
    { name: "group4", pic: <User size={18} /> },
    { name: "group5", pic: <User size={18} /> },
    { name: "group6", pic: <User size={18} /> },
    { name: "group7", pic: <User size={18} /> },
    { name: "group8", pic: <User size={18} /> },
    { name: "group8", pic: <User size={18} /> },
    { name: "group8", pic: <User size={18} /> },
    { name: "group8", pic: <User size={18} /> },
    { name: "group8", pic: <User size={18} /> },
  ];

  return (
    <ScrollArea className="h-screen w-full border-r">
      <div className="flex flex-col gap-2 p-4">
        {projects.map((g, idx) => (
          
          <div
            key={idx}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-100 cursor-pointer transition-colors"
          ><Link href={`/main/teams/${g._id}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700">
              {g.image}
            </span>

            <p className="text-sm font-medium text-slate-700">
              {g.name}
            </p></Link>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
"use client"

import { getProject } from "@/app/frontendLib/projectlib/projectapi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Project{
  name:string,
  about:string,
  _id:string,
  ownerId:string,
  image:string |null
}

export default function Groups({ onNavigate }: { onNavigate?: () => void }) {
  const {data:projects=[],isLoading,
    error}=useQuery<Project[]>({queryKey:["project"],
      queryFn:getProject,
      staleTime:5*60*1000
    })
  return (
    <ScrollArea className="h-full w-full">
      <div className="border-b border-border/60 px-5 py-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Project chats</p><h2 className="mt-1 text-lg font-bold tracking-tight">Your teams</h2></div>
      <div className="flex flex-col gap-1.5 p-3">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading projects
          </div>
        )}
        {error && (
          <p className="px-3 py-8 text-center text-sm text-destructive">Could not load your projects.</p>
        )}
        {!isLoading && !error && projects.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            <MessageCircle className="mx-auto mb-2 h-5 w-5" /> No project chats yet.
          </div>
        )}
        {projects.map((g) => (
          
          <div
            key={g._id}
            className="rounded-xl transition-colors hover:bg-accent"
          ><Link href={`/main/teams/${g._id}`} onClick={onNavigate} className="flex items-center gap-3 p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
              {g.image || g.name?.slice(0, 2).toUpperCase()}
            </span>

            <p className="truncate text-sm font-semibold text-foreground">
              {g.name}
            </p></Link>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

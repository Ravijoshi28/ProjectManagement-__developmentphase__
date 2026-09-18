"use client";

import { getProject } from "@/app/frontendLib/projectlib/projectapi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Project {
  name: string;
  about: string;
  _id: string;
  ownerId: string;
  image: string | null;
}

export default function Groups({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProject,
    staleTime: 5 * 60 * 1000,
  });
  return (
    <ScrollArea className="h-full w-full">
      <div className="border-b border-border px-5 py-5">
        <h2 className="text-lg font-semibold tracking-tight">
          Team conversations
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Keep the discussion close to the work.
        </p>
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading projects
          </div>
        )}
        {error && (
          <p className="px-3 py-8 text-center text-sm text-destructive">
            Could not load your projects.
          </p>
        )}
        {!isLoading && !error && projects.length === 0 && (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            <MessageCircle className="mx-auto mb-2 h-5 w-5" /> No project chats
            yet.
          </div>
        )}
        {projects.map((g) => (
          <div
            key={g._id}
            className={`rounded-xl transition-colors hover:bg-accent ${pathname === `/main/teams/${g._id}` ? "bg-accent" : ""}`}
          >
            <Link
              href={`/main/teams/${g._id}`}
              onClick={onNavigate}
              aria-current={
                pathname === `/main/teams/${g._id}` ? "page" : undefined
              }
              className="flex items-center gap-3 p-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {g.name?.slice(0, 2).toUpperCase()}
              </span>

              <p className="truncate text-sm font-semibold text-foreground">
                {g.name}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

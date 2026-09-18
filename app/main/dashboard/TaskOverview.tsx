"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  FolderKanban,
  CalendarDays,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { recentActivity } from "@/app/frontendLib/dashboardlib/dashBoard";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentActivity {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

const statuses: Record<string, { label: string; style: string }> = {
  todo: { label: "To do", style: "bg-muted text-muted-foreground" },
  inprogress: {
    label: "In progress",
    style: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  review: {
    label: "In review",
    style: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  done: {
    label: "Done",
    style:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
};

export default function TaskOverview() {
  const {
    data: activity = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<RecentActivity[]>({
    queryKey: ["RecentActivity"],
    queryFn: recentActivity,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-5 sm:px-6">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Activity size={18} className="text-primary" /> Recent activity
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            The latest updates across your projects
          </p>
        </div>
        <Link
          href="/main/board"
          className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Open task board"
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>
      <div className="p-5 sm:p-6" aria-busy={isLoading}>
        {isLoading ? (
          <div
            className="space-y-6"
            role="status"
            aria-label="Loading recent activity"
          >
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            <p>Could not load recent activity.</p>
            <button
              onClick={() => refetch()}
              className="mt-3 font-semibold text-primary underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : activity.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <div className="mb-5 rounded-2xl bg-muted p-4 text-primary">
              <FolderKanban size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold">
              Make room for your next big idea
            </h3>
            <p className="mt-2 max-w-64 text-sm leading-6 text-muted-foreground">
              Create or join a project to see your team&apos;s latest work here.
            </p>
            <Link
              href="/main/project"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore projects <ArrowUpRight size={16} />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {activity.map((item) => {
              const status = statuses[item.status] ?? {
                label: item.status || "Task",
                style: "bg-muted text-muted-foreground",
              };
              const date = new Date(item.dueDate);
              return (
                <li
                  key={item._id}
                  className="flex gap-3 py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <FolderKanban size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="break-words text-sm font-medium">
                        {item.title}
                      </h3>
                      <span
                        className={`rounded-md px-2 py-1 text-[11px] font-medium ${status.style}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {!Number.isNaN(date.getTime()) && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          Due{" "}
                          {date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {item.priority && (
                        <span className="capitalize">
                          {item.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
        <span>Keep every task in view</span>
        <Link
          href="/main/board"
          className="font-medium text-primary hover:underline"
        >
          Open board &rarr;
        </Link>
      </div>
    </section>
  );
}

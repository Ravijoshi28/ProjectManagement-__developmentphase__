"use client";
import { getNotification } from "@/app/frontendLib/notifications/notifications";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  BellOff,
  CheckCircle2,
  AlertCircle,
  Info,
  TriangleAlert,
} from "lucide-react";
import { PageHeader } from "@/components/workspace/page-header";
import { EmptyState } from "@/components/workspace/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface NotificationItem {
  _id: string;
  senderId: string;
  sendername: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  projectId: string | null;
  taskId: string | null;
  createdAt?: string;
}

export default function Notification() {
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationItem[], Error>({
    queryKey: ["Notifications"],
    queryFn: getNotification,
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div className="page-shell">
      <PageHeader
        title="Notifications"
        description="Project updates, team invitations, and everything that needs your attention."
        action={
          <span className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            {notifications.length} updates
          </span>
        }
      />
      <div className="max-w-4xl">
        {isLoading ? (
          <div
            className="space-y-3"
            role="status"
            aria-label="Loading notifications"
          >
            {[0, 1, 2].map((n) => (
              <Skeleton key={n} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={Bell}
            title="Could not load notifications"
            description="Try again to get the latest updates."
            action={
              <button
                onClick={() => refetch()}
                className="text-sm font-medium text-primary"
              >
                Try again
              </button>
            }
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="You're all caught up"
            description="When something changes in your projects, your updates will appear here."
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {notifications.map((notification) => {
              const Icon =
                notification.type === "success"
                  ? CheckCircle2
                  : notification.type === "error"
                    ? AlertCircle
                    : notification.type === "warning"
                      ? TriangleAlert
                      : Info;
              const color =
                notification.type === "error"
                  ? "text-destructive bg-destructive/10"
                  : notification.type === "success"
                    ? "text-emerald-700 bg-emerald-500/10 dark:text-emerald-400"
                    : "text-primary bg-primary/10";
              return (
                <li key={notification._id} className="flex gap-4 p-5 sm:p-6">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-sm font-semibold">
                      {notification.title}
                    </h2>
                    <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span>From {notification.sendername || "Your team"}</span>
                      {notification.createdAt && (
                        <time dateTime={notification.createdAt}>
                          {new Date(notification.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                          )}
                        </time>
                      )}
                      {notification.projectId && (
                        <Link
                          href={`/main/project/${notification.projectId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          View project &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

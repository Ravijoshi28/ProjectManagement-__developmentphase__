"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/workspace/page-header";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AssignTask,
  getProject,
  getProjectTask,
} from "@/app/frontendLib/projectlib/projectapi";
import { useUserState } from "@/app/zustand/userState";
import { AddTask } from "../../board/TaskCreating";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { socket } from "@/app/lib/socket";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  File,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import TaskDeleteButton from "../TaskDeleteButton";

interface Member {
  _id: string;
  username: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo?: string;
  members: Member[];
}

interface Project {
  name: string;
  about: string;
  _id: string;
  ownerId: string;
  image: string | null;
  members: Member[];
  assignTo: string | null;
}

const columnStyles: Record<
  string,
  { accent: string; badge: string; icon: typeof Circle }
> = {
  "To Do": {
    accent: "bg-slate-400",
    badge: "bg-muted text-muted-foreground",
    icon: Circle,
  },
  "In Progress": {
    accent: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700",
    icon: Clock3,
  },
  Review: {
    accent: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700",
    icon: Search,
  },
  Completed: {
    accent: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
};

export default function ProjectId() {
  const queryClient = useQueryClient();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useUserState();
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProject,
    staleTime: 5 * 60 * 1000,
  });

  // Isolate the exact matching single project instance safely
  const currentProject = projects.find((p) => p._id === projectId);

  const assignTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      userId,
    }: {
      taskId: string;
      userId: string | null;
    }) =>
      AssignTask({
        taskId,
        member: userId ?? null,
      }),
    onMutate: async ({ taskId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
      const previousTasks = queryClient.getQueryData<Task[]>([
        "tasks",
        projectId,
      ]);

      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) =>
        old.map((task) =>
          task._id === taskId
            ? { ...task, assignedTo: userId ?? undefined }
            : task,
        ),
      );
      socket.emit("notification", { addedEmail: [userId] });
      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
    },
  });

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const projectTasks = await getProjectTask(projectId!);
      return projectTasks ?? [];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!projectId) return;

    socket.emit("join-project", projectId);

    const handleNewTask = () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    };

    socket.on("receive-task", handleNewTask);
    socket.on("receive-assigned", handleNewTask);

    return () => {
      socket.off("receive-task", handleNewTask);
      socket.off("receive-assigned", handleNewTask);
    };
  }, [projectId, queryClient]);

  if (!projectId) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="font-semibold text-foreground">No project selected</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Choose a project to view and manage its tasks.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
        <p className="font-semibold text-foreground">Loading project board</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Getting your workspace ready...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <p className="font-semibold text-foreground">Unable to load tasks</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while fetching this project.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-4">
          <File />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          Start your project board
        </h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
          Create your first task and turn your project goals into clear,
          actionable work.
        </p>
        <div className="mt-5">
          <AddTask
            projectId={projectId}
            trigger={
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create first task
              </span>
            }
          />
        </div>
      </div>
    );
  }

  const columns = [
    {
      id: "To Do",
      label: "To Do",
      list: tasks.filter((t) => t.status === "To Do"),
    },
    {
      id: "In Progress",
      label: "In Progress",
      list: tasks.filter((t) => t.status === "In Progress"),
    },
    {
      id: "Review",
      label: "Review",
      list: tasks.filter((t) => t.status === "Review"),
    },
    {
      id: "Completed",
      label: "Completed",
      list: tasks.filter((t) => t.status === "Completed"),
    },
  ];

  return (
    <div className="page-shell">
      <Link
        href="/main/project"
        className="mb-5 inline-flex text-sm text-muted-foreground hover:text-primary"
      >
        &larr; All projects
      </Link>
      <PageHeader
        title={currentProject?.name || "Project board"}
        description={
          currentProject?.about ||
          "Keep assignments, priorities, and progress in one place."
        }
        action={
          <span className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        }
      />
      {/* Grid Container Workspace Area - Horizontal Scroll Responsive on Mobile */}
      <div className="flex snap-x snap-mandatory flex-row items-start gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 md:gap-5 2xl:grid 2xl:grid-cols-4 2xl:snap-none">
        {columns.map((column) => {
          const style = columnStyles[column.id];
          const ColumnIcon = style.icon;

          return (
            <div
              key={column.id}
              className="relative flex min-h-[420px] w-[290px] shrink-0 snap-center flex-col gap-3 rounded-2xl border border-border bg-muted/50 p-3 sm:w-[320px] md:gap-4 md:p-4 2xl:w-full 2xl:min-w-0"
            >
              {/* Column Header Metadata */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${style.accent}`} />
                  <ColumnIcon className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-xs font-bold text-foreground md:text-sm">
                    {column.label}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}
                >
                  {column.list.length}
                </span>
              </div>

              {/* Task Area Stack Loop */}
              <div className="space-y-3 flex-1 min-w-0">
                {column.list.map((task) => {
                  // Find currently assigned project team member explicitly
                  const assignedMember = currentProject?.members?.find(
                    (m) => m._id === task.assignedTo,
                  );

                  return (
                    <div
                      key={task._id}
                      className="group flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                    >
                      <div>
                        {/* Priority Tag Header Line */}
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className="font-semibold text-xs md:text-sm text-foreground leading-snug line-clamp-2">
                            {task.title}
                          </h3>
                          <div className="flex items-start gap-1">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wide shrink-0
                            ${
                              task.priority.startsWith("High") ||
                              task.priority === "Critical"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : task.priority.startsWith("Medium")
                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                  : "bg-green-50 text-green-700 border border-green-100"
                            }
                          `}
                            >
                              {task.priority}
                            </span>
                            {user?.id === currentProject?.ownerId && (
                              <TaskDeleteButton
                                taskId={task._id}
                                taskTitle={task.title}
                                queryKey={["tasks", projectId]}
                              />
                            )}
                          </div>
                        </div>

                        <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {task.description || "No description provided."}
                        </p>
                      </div>

                      {/* Meta Controls Bottom Panel Footer */}
                      <div className="border-t border-border/60 pt-3 flex flex-col gap-2.5">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <CalendarDays size={13} />
                          <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground">
                            Due:{" "}
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "No date"}
                          </span>
                        </div>

                        {/* Explicit Member Assignment Component Node Selector */}
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <Select
                            value={task.assignedTo || "unassigned"}
                            onValueChange={(userId) => {
                              assignTaskMutation.mutate({
                                taskId: task._id,
                                userId: userId === "unassigned" ? null : userId,
                              });
                              socket.emit("task-assigned", userId);
                            }}
                          >
                            <SelectTrigger
                              aria-label={`Assign ${task.title}`}
                              className="w-full h-8 text-[11px] font-medium rounded-lg border-border bg-card hover:bg-slate-50 shadow-none focus:ring-1 focus:ring-blue-500/20"
                            >
                              <SelectValue placeholder="Assign member">
                                {assignedMember?.username || "Assign member"}
                              </SelectValue>
                            </SelectTrigger>

                            <SelectContent className="rounded-xl">
                              <SelectGroup>
                                <SelectLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                                  Team Members
                                </SelectLabel>

                                <SelectItem
                                  value="unassigned"
                                  className="text-xs text-muted-foreground italic"
                                >
                                  Unassigned
                                </SelectItem>

                                {task?.members?.map((m) => (
                                  <SelectItem
                                    key={m._id}
                                    value={m._id || ""}
                                    className="text-xs"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-[9px] font-bold ring-1 ring-slate-200">
                                        {m.username?.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="truncate font-medium text-foreground">
                                        {m.username}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>

                          {assignTaskMutation.isPending && (
                            <span className="text-[9px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded animate-pulse shrink-0">
                              Saving...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {column.list.length === 0 && (
                  <div className="text-[11px] font-medium text-muted-foreground text-center py-8 border border-dashed border-slate-300 rounded-xl bg-white/40">
                    No tasks in this stage
                  </div>
                )}
              </div>

              {/* Inline Card Creation Trigger Hook */}
              <div className="mt-1">
                <AddTask
                  projectId={projectId}
                  status={column.id}
                  trigger={
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      Add task
                    </>
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

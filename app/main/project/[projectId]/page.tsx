"use client";

import { useEffect } from "react";
import { useProjectState } from "@/app/zustand/useProjectState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssignTask, getProject, getProjectTask } from "@/app/frontendLib/projectlib/projectapi";
import { useUserState } from "@/app/zustand/userState";
import { AddTask } from "../../board/TaskCreating";
import {
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { socket } from "@/app/lib/socket";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  File,
  FileIcon,
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
    badge: "bg-slate-100 text-slate-600",
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
  const { projectId } = useProjectState();
  const { user } = useUserState();
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProject,
    staleTime: 5 * 60 * 1000,
  });
  
  // Isolate the exact matching single project instance safely
  const currentProject = projects.find((p) => p._id === projectId);

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string | null }) =>
      AssignTask({
        taskId,
        member: userId ?? null,
      }),
    onMutate: async ({ taskId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      await queryClient.refetchQueries({ queryKey: ["notifications"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]);

      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) =>
        old.map((task) =>
          task._id === taskId ? { ...task, assignedTo: userId ?? undefined } : task
        )
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
    queryFn:  async () => {
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
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <AlertCircle className="h-7 w-7 text-slate-400" />
        </div>
        <p className="font-semibold text-slate-800">No project selected</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
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
        <p className="font-semibold text-slate-800">Loading project board</p>
        <p className="mt-1 text-sm text-slate-500">Getting your workspace ready...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <p className="font-semibold text-slate-900">Unable to load tasks</p>
        <p className="mt-1 text-sm text-slate-500">
          Something went wrong while fetching this project.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-4">
        <File/>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Start your project board</h2>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
          Create your first task and turn your project goals into clear, actionable work.
        </p>
        <div className="mt-5">
          <AddTask
            trigger={
              <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                <Plus className="h-4 w-4" />
                Create first task
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const columns = [
    { id: "To Do", label: "To Do", list: tasks.filter((t) => t.status === "To Do") },
    { id: "In Progress", label: "In Progress", list: tasks.filter((t) => t.status === "In Progress") },
    { id: "Review", label: "Review", list: tasks.filter((t) => t.status === "Review") },
    { id: "Completed", label: "Completed", list: tasks.filter((t) => t.status === "Completed") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-4 font-sans sm:p-6 md:p-8">
      {/* Header Context Metadata */}
      <div className="mb-7 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
          <FileIcon className="h-3 w-3" />
          Project workspace
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
          {currentProject?.name ? `${currentProject.name} Board` : "Project Board"}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          {currentProject?.about || "Track and manage team assignments and project status."}
        </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm">
          <span className="font-bold text-slate-900">{tasks.length}</span>{" "}
          {tasks.length === 1 ? "task" : "tasks"} total
        </div>
      </div>

      {/* Grid Container Workspace Area - Horizontal Scroll Responsive on Mobile */}
      <div className="flex snap-x snap-mandatory flex-row items-start gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 md:gap-5 lg:grid lg:grid-cols-4 lg:snap-none">
        {columns.map((column) => {
          const style = columnStyles[column.id];
          const ColumnIcon = style.icon;

          return (
          <div
            key={column.id}
            className="flex min-h-[560px] w-[290px] shrink-0 snap-center flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-100/70 p-3 sm:w-[320px] md:gap-4 md:p-4 lg:w-full"
          >
            {/* Column Header Metadata */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${style.accent}`} />
                <ColumnIcon className="h-4 w-4 text-slate-500" />
                <h2 className="text-xs font-bold text-slate-800 md:text-sm">
                  {column.label}
                </h2>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}>
                {column.list.length}
              </span>
            </div>

            {/* Task Area Stack Loop */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
              {column.list.map((task) => {
                // Find currently assigned project team member explicitly
                const assignedMember = currentProject?.members?.find(
                  (m) => m._id === task.assignedTo
                );

                return (
                  <div
                    key={task._id}
                    className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div>
                      {/* Priority Tag Header Line */}
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h3 className="font-semibold text-xs md:text-sm text-slate-900 leading-snug line-clamp-2">
                          {task.title}
                        </h3>
                        <div className="flex items-start gap-1"><span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wide shrink-0
                            ${
                              task.priority === "High" || task.priority === "Critical"
                                ? "bg-red-50 text-red-600 border border-red-100"
                                : task.priority === "Medium"
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
                        )}</div>
                      </div>

                      <p className="text-[11px] md:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    {/* Meta Controls Bottom Panel Footer */}
                    <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CalendarDays size={13} />
                        <span className="text-[10px] md:text-[11px] font-medium text-slate-500">
                          Due:{" "}
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })
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
                              userId: userId === "unassigned" ? " " : userId,
                            });
                            socket.emit("task-assigned", userId);
                          }}
                        >
                          <SelectTrigger className="w-full h-8 text-[11px] font-medium rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-none focus:ring-1 focus:ring-blue-500/20">
                            <SelectValue placeholder="Assign member">
                              {assignedMember?.username || "Assign member"}
                            </SelectValue>
                          </SelectTrigger>

                          <SelectContent className="rounded-xl">
                            <SelectGroup>
                              <SelectLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1.5">
                                Team Members
                              </SelectLabel>
                              
                              <SelectItem value="unassigned" className="text-xs text-slate-500 italic">
                                Unassigned
                              </SelectItem>

                              {task?.members?.map((m) => (
                                <SelectItem
                                  key={m._id}
                                  value={m._id || ""}
                                  className="text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold ring-1 ring-slate-200">
                                      {m.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate font-medium text-slate-700">{m.username}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        {assignTaskMutation.isPending && (
                          <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded animate-pulse shrink-0">
                            Saving...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {column.list.length === 0 && (
                <div className="text-[11px] font-medium text-slate-400 text-center py-8 border border-dashed border-slate-300 rounded-xl bg-white/40">
                  No tasks in this stage
                </div>
              )}
            </div>

            {/* Inline Card Creation Trigger Hook */}
            <div className="mt-1">
              <AddTask
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

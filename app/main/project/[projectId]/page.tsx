"use client";

import React, { useEffect } from "react";
import { useProjectState } from "@/app/zustand/useProjectState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AssignTask, getProjectTask } from "@/app/frontendLib/projectlib/projectapi";
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
import { Calendar, AlertCircle, Loader2 } from "lucide-react";

interface User {
  _id: string;
  name: string;
}

interface Member {
  _id: string;
  username:string
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo?: string;
  members:Member []
}

interface Project {
  name: string;
  about: string;
  _id: string;
  ownerId: string;
  image: string | null;
  members: Member[];
  assignTo:string | null
}

export default function ProjectId() {
  const queryClient = useQueryClient();
  const { projectId } = useProjectState();
  console.log(projectId)
  // Retrieve project list cache safely
  const projects = queryClient.getQueryData<Project[]>(["projects"]) || [];
  
  // Isolate the exact matching single project instance safely
  const currentProject = projects.find((p) => p._id === projectId);

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string |null }) =>
      AssignTask({
        taskId,
        member: userId??null,
      }),
    onMutate: async ({ taskId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      await queryClient.refetchQueries({queryKey:["notifications"]})
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]);

      queryClient.setQueryData<Task[]>(["tasks", projectId], (old = []) =>
        old.map((task) =>
          task._id === taskId ? { ...task, assignedTo: userId ?? undefined } : task
        )
      );
      socket.emit("notification",{addedEmail:[userId]})
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
    queryFn: () => getProjectTask(projectId!),
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
    socket.on("receive-assigned",handleNewTask)

    return () => {
      socket.off("receive-task", handleNewTask);
      socket.off("receive-assigned",handleNewTask)
    };
  }, [projectId, queryClient]);

  console.log(tasks);

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertCircle className="h-8 w-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium text-slate-500">No project selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin mb-2" />
        <p className="text-sm font-medium text-slate-500">Loading workspace tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm font-medium text-red-500">Failed to fetch project tasks.</p>
         <div className="mt-1">
              <AddTask
                
                trigger={
                  
                  <p>   + Add Task</p>
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
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      {/* Header Context Metadata */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          {currentProject?.name ? `${currentProject.name} Board` : "Project Board"}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          {currentProject?.about || "Track and manage team assignments and project status."}
        </p>
      </div>

      {/* Grid Container Workspace Area - Horizontal Scroll Responsive on Mobile */}
      <div className="flex flex-row gap-4 md:gap-6 overflow-x-auto pb-6 items-start scrollbar-thin scrollbar-thumb-slate-200 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:snap-none">
        {columns.map((column) => (
          <div
            key={column.id}
            className="w-[290px] sm:w-[320px] lg:w-full flex flex-col gap-3 md:gap-4 shrink-0 snap-center bg-slate-100/70 border border-slate-200/50 rounded-xl p-3 md:p-4 min-h-[550px]"
          >
            {/* Column Header Metadata */}
            <div className="flex items-center justify-between px-1">
              <h2 className="font-semibold text-xs md:text-sm text-slate-800">{column.label}</h2>
              <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold border border-slate-200 text-slate-600 shadow-sm">
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
                    className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-150 flex flex-col justify-between gap-4"
                  >
                    <div>
                      {/* Priority Tag Header Line */}
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h3 className="font-semibold text-xs md:text-sm text-slate-900 leading-snug line-clamp-2">
                          {task.title}
                        </h3>
                        <span
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
                      </div>

                      <p className="text-[11px] md:text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {task.description || "No description provided."}
                      </p>
                    </div>

                    {/* Meta Controls Bottom Panel Footer */}
                    <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={13} />
                        <span className="text-[10px] md:text-[11px] font-medium text-slate-500">
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "No Date"}
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
                            socket.emit("task-assigned",userId)
                          }}
                        >
                          <SelectTrigger className="w-full h-8 text-[11px] font-medium rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-none focus:ring-1 focus:ring-blue-500/20">
                            <SelectValue placeholder="Assign member">
                              {task.assignedTo ? task.assignedTo : "Assign member"}
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
                  No active tasks
                </div>
              )}
            </div>

            {/* Inline Card Creation Trigger Hook */}
            <div className="mt-1">
              <AddTask
                status={column.id}
                trigger={
                  
                  <p>   + Add Task</p>
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
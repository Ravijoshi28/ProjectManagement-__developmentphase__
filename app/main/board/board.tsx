"use client";

import React, { useEffect, useRef } from "react";
import {
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Eye,
  ListTodo,
  Calendar,
  Plus,
  Settings,
} from "lucide-react";
import { AddTask } from "./TaskCreating";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { UserTasks, updateTaskStatus } from "@/app/frontendLib/userlib/userapis";
import { useUserState } from "@/app/zustand/userState";

interface Tasks {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo?: string;
}

export default function BoardPage() {
  const { user } = useUserState();
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdates = useRef<Record<string, string>>({});

  const updateMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      updateTaskStatus(taskId, status),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["UserTask"] });
    },
  });

  const { data: tasks = [], isLoading, error } = useQuery<Tasks[]>({
    queryKey: ["UserTask"],
    queryFn: () => UserTasks(user),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getColumns = (taskList: Tasks[]) => [
    {
      id: "To Do",
      title: "To Do",
      icon: <ListTodo size={16} className="text-slate-500" />,
      color: "bg-slate-50/60",
      tasks: taskList.filter((t) => t.status === "To Do"),
    },
    {
      id: "In Progress",
      title: "In Progress",
      icon: <Clock size={16} className="text-blue-500" />,
      color: "bg-blue-50/40",
      tasks: taskList.filter((t) => t.status === "In Progress"),
    },
    {
      id: "Review",
      title: "Review",
      icon: <Eye size={16} className="text-purple-500" />,
      color: "bg-purple-50/40",
      tasks: taskList.filter((t) => t.status === "Review"),
    },
    {
      id: "Completed",
      title: "Completed",
      icon: <CheckCircle2 size={16} className="text-green-500" />,
      color: "bg-green-50/40",
      tasks: taskList.filter((t) => t.status === "Completed"),
    },
  ];

  const boardData = getColumns(tasks);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;

    queryClient.setQueryData<Tasks[]>(["UserTask"], (oldTasks = []) =>
      oldTasks.map((task) =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    pendingUpdates.current[draggableId] = newStatus;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      const updates = { ...pendingUpdates.current };
      pendingUpdates.current = {};

      try {
        await Promise.all(
          Object.entries(updates).map(([taskId, status]) =>
            updateMutation.mutateAsync({ taskId, status })
          )
        );
      } catch (err) {
        console.error(err);
        queryClient.invalidateQueries({ queryKey: ["UserTask"] });
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm text-slate-500 font-medium">
        Loading personal workspace...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm text-red-500 font-medium">
        Failed to load tasks. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-8 font-sans">
      {/* Refined Header Block */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">My Personal Tasks</h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">Organize and manage your individual workflow and assignments.</p>
      </div>

      {/* Fully Responsive Drag and Drop Grid Canvas Container */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row gap-4 md:gap-6 overflow-x-auto pb-6 items-start scrollbar-thin scrollbar-thumb-slate-200 snap-x snap-mandatory md:snap-none">
          {boardData.map((column) => (
            <div
              key={column.id}
              className="w-[290px] sm:w-[320px] md:w-[340px] flex flex-col gap-3 md:gap-4 shrink-0 snap-center"
            >
              {/* Column Meta Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 md:gap-2.5">
                  {column.icon}
                  <h3 className="font-semibold text-xs md:text-sm text-slate-800">
                    {column.title}
                  </h3>
                  <span className="bg-slate-200/60 text-slate-700 text-[11px] md:text-xs font-medium px-2 py-0.5 rounded-md">
                    {column.tasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button type="button" className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                    <Settings size={14} />
                  </button>
                  <button type="button" className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Board Droppable Canvas Panel */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col gap-3 rounded-xl p-3 md:p-4 border border-slate-200/60 min-h-[500px] md:min-h-[600px] transition-all duration-200
                      ${column.color}
                      ${snapshot.isDraggingOver ? "ring-2 ring-blue-500/20 bg-blue-50/30 border-blue-200" : ""}
                    `}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`
                              bg-white p-4 rounded-xl border border-slate-200/80 group transition-all duration-150 cursor-grab active:cursor-grabbing shadow-sm
                              ${snapshot.isDragging ? "shadow-xl border-blue-200 ring-1 ring-blue-500/10 rotate-[1deg]" : "hover:border-slate-300 hover:shadow-md"}
                            `}
                          >
                            {/* Priority Row */}
                            <div className="flex justify-between items-start mb-2.5">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wide
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
                              <button type="button" className="text-slate-400 md:opacity-0 md:group-hover:opacity-100 hover:text-slate-600 p-0.5 rounded transition-all">
                                <MoreHorizontal size={14} />
                              </button>
                            </div>

                            {/* Core Description Typography Details */}
                            <h5 className="text-xs md:text-sm font-semibold text-slate-900 mb-1 leading-snug">
                              {task.title}
                            </h5>
                            <p className="text-[11px] md:text-xs text-slate-500 line-clamp-2 mb-3.5 leading-relaxed">
                              {task.description || "No description provided."}
                            </p>

                            {/* Task Meta Footer Row */}
                            <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5">
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Calendar size={13} />
                                <span className="text-[10px] md:text-[11px] font-medium text-slate-500">
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : "No Date"}
                                </span>
                              </div>
                              
                              <div className="flex -space-x-1.5 overflow-hidden">
                                <div className="inline-block h-4 w-4 md:h-5 md:w-5 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[8px] md:text-[9px] font-bold text-slate-600">
                                  ME
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {/* Add Inline Card Task Action Element */}
                    <div className="mt-1">
                      <AddTask
                        status={column.id}
                        title="title"
                        trigger={
                          <p className="w-full flex items-center justify-center gap-2 p-2 md:p-2.5 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs font-medium hover:border-slate-400 hover:text-slate-700 hover:bg-white/80 transition-all duration-150">
                            <Plus size={14} />
                            Add Task
                          </p>
                            
                        
                        }
                      />
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
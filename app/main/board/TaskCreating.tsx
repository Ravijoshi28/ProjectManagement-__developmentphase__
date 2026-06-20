"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Flag, Calendar, ListTodo } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/app/frontendLib/projectlib/projectapi";
import { useProjectState } from "@/app/zustand/useProjectState";
import { socket } from "@/app/lib/socket";

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  status: string;
}

interface AddTaskProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  status?: string;
}

export function AddTask({
  trigger,
  title = "",
  description = "",
  status = "Todo",
}: AddTaskProps) {
  const today = new Date().toISOString().split("T")[0];
  const {projectId}=useProjectState();

  const [open, setOpen] = React.useState(false);

  const [formData, setFormData] = React.useState<TaskFormData>({
    title,
    description,
    priority: "High Priority",
    dueDate: today,
    status:"To Do",
  });

  const queryClient = useQueryClient();
  const createTaskMutation = useMutation({
  mutationFn: createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["tasks",projectId],
    });
  },
});

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  

  if (!projectId) {
    console.log("No project id");
    return;
  }

  try {
  console.log("1 before mutation");
    console.log(socket.id)
  await createTaskMutation.mutateAsync({
    projectId,
    formData,
  });

  console.log("2 after mutation");
  socket.emit("join-project",projectId)
  socket.emit("task-created", {
    projectId,
    formData,
  });

  console.log("3 after emit");
} catch (err) {
  console.error("mutation error", err);
}finally {
    setOpen(false);
  }
};
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {title ? "Edit Task" : "Create Task"}
          </DialogTitle>

          <DialogDescription>
            Fill in the details below and save your task.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  title: e.target.value,
                })
              }
              placeholder="Task title"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder="Task description"
              rows={4}
              className="w-full rounded-lg border px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Priority + Due Date */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Priority */}
  <div className="space-y-2">
    <label className="text-sm font-medium">
      Priority
    </label>

    <div className="relative">
     

      <select
        value={formData.priority}
        onChange={(e) =>
          setFormData({
            ...formData,
            priority: e.target.value,
          })
        }
        className="h-10 w-full appearance-none rounded-lg border border-input bg-background pl-1 pr-5 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="High Priority">High Priority</option>
        <option value="Medium Priority">Medium Priority</option>
        <option value="Low Priority">Low Priority</option>
      </select>

      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
    </div>
  </div>

  {/* Due Date */}
  <div className="space-y-2">
    <label className="text-sm font-medium">
      Due Date
    </label>

    <input
      type="date"
      min={today}
      value={formData.dueDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          dueDate: e.target.value,
        })
      }
      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
    />
  </div>
</div>

{/* Status */}
<div className="space-y-2">
  <label className="text-sm font-medium">
    Status
  </label>

  <div className="relative">
   

    <select
      value={formData.status}
      onChange={(e) =>
        setFormData({
          ...formData,
          status: e.target.value,
        })
      }
      className="h-10 w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="To Do">To Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Review">Review</option>
      <option value="Completed">Completed</option>
    </select>

    <ChevronDown
      size={16}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
    />
  </div>
</div>
             
          <DialogFooter>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
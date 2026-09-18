"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  getProject,
} from "@/app/frontendLib/projectlib/projectapi";
import { socket } from "@/app/lib/socket";
import { toast } from "sonner";

interface AddTaskProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  status?: string;
  projectId?: string;
}
export function AddTask({
  trigger,
  title = "",
  description = "",
  status = "To Do",
  projectId,
}: AddTaskProps) {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState("");
  const initialForm = {
    title,
    description,
    priority: "Medium Priority",
    dueDate: "",
    status,
  };
  const [formData, setFormData] = React.useState(initialForm);
  const client = useQueryClient();
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery<{ _id: string; name: string }[]>({
    queryKey: ["projects"],
    queryFn: getProject,
    enabled: open && !projectId,
    staleTime: 5 * 60 * 1000,
  });
  const activeProject = projectId || selectedProject;
  const mutation = useMutation({ mutationFn: createTask });
  const control =
    "h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!activeProject || mutation.isPending || !formData.title.trim()) return;
    try {
      await mutation.mutateAsync({
        projectId: activeProject,
        formData: { ...formData, title: formData.title.trim() },
      });
      await Promise.all([
        client.invalidateQueries({ queryKey: ["tasks", activeProject] }),
        client.invalidateQueries({ queryKey: ["UserTask"] }),
        client.invalidateQueries({ queryKey: ["RecentActivity"] }),
      ]);
      socket.emit("task-created", { projectId: activeProject, formData });
      toast.success("Task created");
      setOpen(false);
      setFormData(initialForm);
    } catch {
      toast.error(
        "Could not create your task. Your details are still here to retry.",
      );
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!mutation.isPending) setOpen(next);
      }}
    >
      <DialogTrigger className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary">
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create task
          </DialogTitle>
          <DialogDescription>
            Give your next step a name, a priority, and a place to live.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset
            disabled={mutation.isPending}
            className="space-y-5 disabled:opacity-70"
          >
            {!projectId && (
              <div className="space-y-2">
                <Label htmlFor={`${id}-project`}>Project</Label>
                <select
                  id={`${id}-project`}
                  className={control}
                  value={selectedProject}
                  onChange={(event) => setSelectedProject(event.target.value)}
                  required
                >
                  <option value="">
                    {isLoading ? "Loading projects..." : "Choose a project"}
                  </option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {isError && (
                  <p className="text-xs text-destructive">
                    Projects could not be loaded. Close this dialog and try
                    again.
                  </p>
                )}
                {!isLoading && !isError && projects.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Create or join a project before adding tasks.
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor={`${id}-title`}>Task name</Label>
              <Input
                id={`${id}-title`}
                value={formData.title}
                onChange={(event) =>
                  setFormData({ ...formData, title: event.target.value })
                }
                placeholder="What needs to get done?"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-description`}>
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <textarea
                id={`${id}-description`}
                value={formData.description}
                onChange={(event) =>
                  setFormData({ ...formData, description: event.target.value })
                }
                placeholder="Add context, details, or a definition of done..."
                rows={3}
                className={`${control} h-auto resize-y py-3`}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${id}-priority`}>Priority</Label>
                <select
                  id={`${id}-priority`}
                  value={formData.priority}
                  onChange={(event) =>
                    setFormData({ ...formData, priority: event.target.value })
                  }
                  className={control}
                >
                  {["Low Priority", "Medium Priority", "High Priority"].map(
                    (value) => (
                      <option key={value}>{value}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-due`}>Due date</Label>
                <input
                  id={`${id}-due`}
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(event) =>
                    setFormData({ ...formData, dueDate: event.target.value })
                  }
                  className={control}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-status`}>Status</Label>
              <select
                id={`${id}-status`}
                value={formData.status}
                onChange={(event) =>
                  setFormData({ ...formData, status: event.target.value })
                }
                className={control}
              >
                {["To Do", "In Progress", "Review", "Completed"].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  ),
                )}
              </select>
            </div>
          </fieldset>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={mutation.isPending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                mutation.isPending || !activeProject || !formData.title.trim()
              }
            >
              {mutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {mutation.isPending ? "Creating..." : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

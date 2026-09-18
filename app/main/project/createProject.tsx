"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "@/app/frontendLib/projectlib/projectapi";
import { toast } from "sonner";

export default function CreateProjectModal() {
  const [formdata, setdata] = useState({ name: "", about: "" });
  const [open, setOpen] = useState(false);

  const clientQuery = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      clientQuery.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mutation.isPending) return;
    try {
      await mutation.mutateAsync(formdata);
      setOpen(false);
      setdata({ name: "", about: "" });
      toast.success("Project created");
    } catch {
      toast.error("Project not created...");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-10 rounded-xl gap-2" />}>
        <Plus size={16} />
        New project
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-xl shadow-lg border border-border bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight">
              Create Project
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Give your project a name and a little context for your team.
            </DialogDescription>
          </DialogHeader>

          {/* Form Input fields */}
          <div className="grid gap-5 py-5">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-muted-foreground"
              >
                Name of the Project
              </Label>
              <Input
                id="name"
                value={formdata.name}
                onChange={(e) => setdata({ ...formdata, name: e.target.value })}
                placeholder="e.g., Marketing Campaign"
                className="h-10 rounded-lg border-muted bg-background focus-visible:ring-primary"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="about"
                className="text-sm font-medium text-muted-foreground"
              >
                About / Description
              </Label>
              <Input
                id="about"
                value={formdata.about}
                placeholder="Brief summary of the goals..."
                onChange={(e) =>
                  setdata({ ...formdata, about: e.target.value })
                }
                className="h-10 rounded-lg border-muted bg-background focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Action Row */}
          <DialogFooter className="gap-2 sm:gap-0 border-t border-muted pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-lg text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-lg text-xs font-medium shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {mutation.isPending ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

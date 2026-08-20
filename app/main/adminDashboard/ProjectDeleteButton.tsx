"use client";

import { deleteAdminProject } from "@/app/frontendLib/adminlib/admin";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProjectDeleteButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteAdminProject(projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      setOpen(false);
      toast.success("Project deleted");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete project"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700" />}>
        <Trash2 className="h-4 w-4" /> Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            “{projectName}” and all of its tasks, messages, memberships, and notifications will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Delete project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

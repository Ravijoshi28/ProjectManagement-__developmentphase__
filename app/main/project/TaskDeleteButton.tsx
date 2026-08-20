"use client";

import { deleteTask } from "@/app/frontendLib/projectlib/projectapi";
import { Button } from "@/components/ui/button";
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
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TaskDeleteButton({
  taskId,
  taskTitle,
  queryKey,
}: {
  taskId: string;
  taskTitle: string;
  queryKey: readonly unknown[];
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      await queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      setOpen(false);
      toast.success("Task deleted");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not delete task"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground hover:bg-red-50 hover:text-red-600" />}>
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete {taskTitle}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete task?</DialogTitle>
          <DialogDescription>
            “{taskTitle}” will be permanently deleted. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

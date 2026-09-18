"use client";

import { AddMembers } from "@/app/frontendLib/projectlib/projectapi";
import { socket } from "@/app/lib/socket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface AddmemberProps {
  trigger: React.ReactNode;
  projectId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export default function AddMember({ trigger, projectId }: AddmemberProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [debounceEmail, setDebounceEmail] = useState("");
  const [addedEmail, setAddEmail] = useState<{ email: string; id: string }[]>(
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceEmail(email);
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const { data, isLoading } = useQuery({
    queryKey: ["member-search", debounceEmail],
    queryFn: async () => {
      const res = await fetch(`/api/project/search?email=${debounceEmail}`);

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    },
    enabled: debounceEmail.trim().length > 0,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => AddMembers({ projectId, formdata: { addedEmail } }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      socket.emit("notification", { addedEmail });

      setAddEmail([]);
      setEmail("");
      setDebounceEmail("");
      setOpen(false);
      toast.success("Members added");
    },

    onError: () => {
      toast.error("Could not add members. Please try again.");
    },
  });

  const submit = () => {
    if (addedEmail.length === 0 || mutation.isPending) return;
    mutation.mutate();
  };

  const users: User[] = Array.isArray(data?.message)
    ? data.message
    : Array.isArray(data?.users)
      ? data.users
      : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label="Add project members">{trigger}</DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
          <DialogDescription>
            Search users by email and add them to this project.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="member-email">Email address</Label>

          <input
            id="member-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@email.com"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-sm text-muted-foreground">Searching...</div>
        )}

        {/* Search Results */}
        <ScrollArea className="h-52 rounded-xl border">
          {users.length > 0 ? (
            users.map((user) => (
              <button
                type="button"
                aria-pressed={addedEmail.some(
                  (member) => member.id === user._id,
                )}
                key={user._id}
                onClick={() =>
                  setAddEmail((prev) => {
                    const exists = prev.some(
                      (member) => member.email === user.email,
                    );

                    if (exists) return prev;

                    return [...prev, { email: user.email, id: user._id }];
                  })
                }
                className="flex w-full items-center gap-3 border-b p-3 text-left transition-colors hover:bg-muted aria-pressed:bg-accent"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {(user.name || user.email).slice(0, 2).toUpperCase()}
                </span>

                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="break-all text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </button>
            ))
          ) : debounceEmail ? (
            <p className="text-sm text-slate-500 p-3">No user found</p>
          ) : (
            <p className="text-sm text-slate-500 p-3">Search for a user</p>
          )}
        </ScrollArea>

        {/* Selected Members */}
        {addedEmail.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Members</Label>

            <div className="flex flex-wrap gap-2">
              {addedEmail.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                >
                  <span>{member.email}</span>

                  <button
                    type="button"
                    aria-label={`Remove ${member.email}`}
                    onClick={() =>
                      setAddEmail((prev) =>
                        prev.filter((item) => item.email !== member.email),
                      )
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={mutation.isPending || addedEmail.length === 0}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {mutation.isPending ? "Adding..." : "Add Members"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

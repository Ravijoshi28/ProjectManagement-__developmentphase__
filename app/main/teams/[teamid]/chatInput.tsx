"use client";

import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/app/frontendLib/messagelib/messageapi";
import { socket } from "@/app/lib/socket";

export default function ChatInput( {projectId
}: {
  projectId: string;
}) {
  const [message, setMessage] = useState("");

    
    
  const queryies=useQueryClient();

  const queryMutation = useMutation({
    mutationFn: sendMessage,
    // onSuccess:()=>{
    //   queryies.invalidateQueries({
    //     queryKey:["messages",projectId]
    //   })
    // }
  });

  const handleSubmit = async (e: React.FormEvent) => {
  
    e.preventDefault();

    if (!message.trim()) return;
    if (!projectId) {
      alert("No project selected");
      return;
    }
    
    await queryMutation.mutateAsync({
      projectId,
      formData: {
        message,
      },
    });
      socket.emit("send-message", {
    projectId,
    message,
  });

  setMessage("");
    
  };
  
  useEffect(() => {
  if (!projectId) return;

  socket.emit("join-project", projectId);
}, [projectId]);

 

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Input your message..."
        className="flex-1 min-w-0 rounded-lg border bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />

      <button
        type="submit"
        disabled={!message.trim()}
        className="inline-flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
}
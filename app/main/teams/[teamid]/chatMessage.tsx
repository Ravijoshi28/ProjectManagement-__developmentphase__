"use client";

import { getMessages } from "@/app/frontendLib/messagelib/messageapi";
import { socket } from "@/app/lib/socket";
import { useUserState } from "@/app/zustand/userState";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    image?: string;
  };
  content: string;
  createdAt: string;
}

export default function ChatMessages({
  projectId,
}: {
  projectId: string;
}) {
  const {user}=useUserState();
    const queryClient = useQueryClient();
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery<Message[]>({
    queryKey: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });



useEffect(() => {
   socket.emit("join-project", projectId);
  const handleMessage = () => {
    queryClient.invalidateQueries({
      queryKey: ["messages", projectId],
    });
  };
  
  socket.on("receive-message", handleMessage);

  return () => {
    socket.off("receive-message", handleMessage);
  };
}, [projectId, queryClient]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-red-500">
        Failed to load messages
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No messages yet. Start the conversation 👋
        </div>
      )}

      {messages.map((msg) => {
  const isMe = msg.senderId?._id === user;

  return (
    <div
      key={msg._id}
      className={`flex flex-col ${
        isMe ? "items-end ml-auto" : "items-start"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-2 mb-1 ${
          isMe ? "flex-row-reverse" : ""
        }`}
      >
        <span className="text-xs font-semibold text-foreground">
          {isMe ? "You" : msg.senderId?.name}
        </span>

      <span className="text-[10px] text-muted-foreground">
  {new Date(msg.createdAt).toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })}
</span>
      </div>

      {/* Message Bubble */}
      <div
        className={`
          px-4 py-2 text-sm shadow-sm break-words max-w-[350px]
          ${
            isMe
              ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
              : "bg-slate-100 text-slate-900 rounded-2xl rounded-bl-md"
          }
        `}
      >
        {msg.content}
      </div>
    </div>
  );
})}
    </div>
  );
}
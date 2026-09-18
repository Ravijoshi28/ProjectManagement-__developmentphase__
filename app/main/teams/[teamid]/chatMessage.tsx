"use client";

import { getMessages } from "@/app/frontendLib/messagelib/messageapi";
import { socket } from "@/app/lib/socket";
import { useUserState } from "@/app/zustand/userState";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    image?: string;
  };
  content: string;
  type: "text" | "file" | "system";
  file?: {
    url: string;
    mimeType: string;
    name?: string;
  };
  createdAt: string;
}

export default function ChatMessages({ projectId }: { projectId: string }) {
  const { user } = useUserState();
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
    <div className="flex flex-col gap-5 py-2">
      {messages.length === 0 && (
        <div className="mx-auto mt-16 rounded-2xl border border-border/60 bg-card px-6 py-5 text-center text-sm text-muted-foreground shadow-sm">
          No messages yet. Start the conversation.
        </div>
      )}

      {messages.map((msg) => {
        const isMe = msg.senderId?._id === user?.id;

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
    max-w-full sm:max-w-[420px] break-words px-4 py-2.5 text-sm shadow-sm
    ${
      isMe
        ? "rounded-2xl rounded-br-md bg-primary text-primary-foreground shadow-primary/10"
        : "rounded-2xl rounded-bl-md border border-border/60 bg-card text-foreground"
    }
  `}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {msg.type === "file" && msg.file && (
                <div className="space-y-2">
                  {msg.file.mimeType?.startsWith("image/") ? (
                    <Image
                      unoptimized
                      width={256}
                      height={192}
                      src={msg.file.url}
                      alt="attachment"
                      className="mt-2 w-full max-w-64 rounded-xl object-cover"
                    />
                  ) : msg.file.mimeType === "application/pdf" ? (
                    <a
                      href={msg.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border p-3 hover:bg-black/5"
                    >
                      Open PDF
                    </a>
                  ) : (
                    <a
                      href={msg.file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border p-3 hover:bg-black/5"
                    >
                      Download file
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

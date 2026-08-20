"use client";

import { useEffect, useState } from "react";
import { Bot, BotIcon, BotMessageSquare, Loader2, MessageCircle, Plus, SendHorizontal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/app/frontendLib/messagelib/messageapi";
import { retrieveAnswer } from "@/app/frontendLib/messagelib/retrievalapi";
import { socket } from "@/app/lib/socket";
import { getUploadErrorMessage, uploadMessageFile } from "@/app/frontendLib/upload/upload";
import { toast } from "sonner";

export default function ChatInput( {projectId
}: {
  projectId: string;
}) {
  const [mode, setMode] = useState<"normal" | "rag">("normal");
  const [aiResponse, setAiResponse] = useState("");
  const [message, setMessage] = useState({
    content:"",
    file:{
      url:"",
      mimeType:"",

    },
    type:""
  });
  
    
    
  const queryMutation = useMutation({
    mutationFn: sendMessage,
  });

  const retrievalMutation = useMutation({
    mutationFn: retrieveAnswer,
    onSuccess: (response) => setAiResponse(response),
    onError: () => toast.error("Could not retrieve an answer. Please try again."),
  });
  
  const handleFile=async(e: React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file) return;

    try {
      const data = await uploadMessageFile(projectId, file);
        setMessage((prev) => ({
          ...prev,
          file: { url: data.url, mimeType: data.mimeType },
        }));
    } catch (error: unknown) {
      toast.error(getUploadErrorMessage(error, "Failed to upload attachment"));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  
    e.preventDefault();

    if (!message.content.trim() && !message.file.url) return;
    if (!projectId) {
      alert("No project selected");
      return;
    }
    const type = message.file.url ? "file" : "text";

    if (mode === "rag") {
      setAiResponse("");
      await retrievalMutation.mutateAsync({
        text: message.content.trim(),
        projectId,
        file: {
          url: message.file.url,
          mimeType: message.file.mimeType,
          text: message.content.trim(),
        },
      });
      setMessage({content:"",type:"",file:{url:"",mimeType:""}});
      return;
    }
    
    
    await queryMutation.mutateAsync({
      projectId,
      message: {
        //need to change in frontlib --message
       content:message.content,
       type:type,
       file:{url:message.file.url,
        mimeType:message.file.mimeType
       },
      },
    });
      socket.emit("send-message", {
    projectId,
    message,
  });

  setMessage({content:"",type:"",file:{
    url:"",mimeType:""
  }});
    
  };
  
  useEffect(() => {
  if (!projectId) return;

  socket.emit("join-project", projectId);
}, [projectId]);

 

  const isSending = queryMutation.isPending || retrievalMutation.isPending;

  return (
    <div className="space-y-2">
      {aiResponse && mode === "rag" && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm shadow-sm">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">RAG answer</p>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">{aiResponse}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 px-1">
        <div className="inline-flex rounded-xl border border-border/70 bg-white/80 p-1 shadow-sm" aria-label="Message mode">
          <button type="button" onClick={() => setMode("normal")} className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${mode === "normal" ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <MessageCircle className="h-3.5 w-3.5" /> Normal
          </button>
          <button type="button" onClick={() => setMode("rag")} className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${mode === "rag" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <BotIcon className="h-3.5 w-3.5" /> RAG
          </button>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">{mode === "rag" ? "Ask your project knowledge" : "Send to everyone"}</span>
      </div>

    <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-2xl border border-border/70 bg-white p-2 shadow-[0_8px_30px_rgba(55,48,110,0.08)]">
      <input
        type="text"
        value={message.content}
        onChange={(e) => setMessage((prev)=>({...prev,content:e.target.value}))}
        placeholder={mode === "rag" ? "Ask about your project..." : "Write a message..."}
        className="h-10 min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
      />
      
      <div className="space-y-4">
     <div className="flex flex-col gap-2">
  {message.file.url && (
    <div className="relative w-fit">
      <img
        src={message.file.url}
        alt="Preview"
        className="h-20 w-20 rounded-xl border object-cover shadow-sm"
      />

      <button
        type="button"
        onClick={() =>
          setMessage((prev) => ({
            ...prev,
            file: {
              mimeType:"",
              url:""
            },
          }))
        }
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
      >
        ✕
      </button>
    </div>
  )}

  <input
    type="file"
    id="image-upload"
    accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    onChange={handleFile}
    className="hidden"
  />

  <label
    htmlFor="image-upload"
    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
  >
    <Plus className="h-5 w-5" />
  </label>
</div>
       
   
       
      </div>
      <button
        type="submit"
        disabled={isSending || (!message.content.trim()&&!message.file.url.trim())}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:translate-y-0 disabled:opacity-40"
      >
        {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === "rag" ? <BotMessageSquare className="h-5 w-5" /> : <SendHorizontal className="h-5 w-5" />}
      </button>
    </form>
    </div>
  );
}

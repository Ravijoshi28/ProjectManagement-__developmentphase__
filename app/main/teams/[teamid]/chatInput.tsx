"use client";

import { useEffect, useState } from "react";
import { Plus, SendHorizontal } from "lucide-react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/app/frontendLib/messagelib/messageapi";
import { socket } from "@/app/lib/socket";
import { supabase } from "@/app/lib/supabase";

export default function ChatInput( {projectId
}: {
  projectId: string;
}) {
  const [message, setMessage] = useState({
    content:"",
    file:{
      url:"",
      mimeType:"",

    },
    type:""
  });
  
    
    
  const queryies=useQueryClient();

  const queryMutation = useMutation({
    mutationFn: sendMessage,
    
  });
  const handleFile=async(e: React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0];
    if(!file) return;

     const filename = `avatar/${crypto.randomUUID()}-${file.name}`;
    
      const { error } = await supabase.storage
        .from("avatar")
        .upload(filename, file);
    
      if (error) {
        console.log(error);
        return;
      }
    
      const { data } = supabase.storage
        .from("avatar")
        .getPublicUrl(filename);
        setMessage((prev) => ({
      ...prev,
      file:{url: data.publicUrl,
        mimeType:file.type
      }
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
  
    e.preventDefault();

    if (!message.content.trim() && !message.file) return;
    if (!projectId) {
      alert("No project selected");
      return;
    }
    const type = message.file.url ? "file" : "text";
    
    
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

 

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={message.content}
        onChange={(e) => setMessage((prev)=>({...prev,content:e.target.value}))}
        placeholder="Input your message..."
        className="flex-1 min-w-0 rounded-lg border bg-background px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition hover:bg-gray-100"
  >
    <Plus className="h-5 w-5" />
  </label>
</div>
       
   
       
      </div>
      <button
        type="submit"
        disabled={!message.content.trim()&&!message.file.url.trim()}
        className="inline-flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
}
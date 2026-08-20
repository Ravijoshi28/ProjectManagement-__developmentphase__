"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TaskOverview from "./TaskOverview";
import { useUserState } from "@/app/zustand/userState";
import { Send, Image as ImageIcon, Loader2, X, Sparkles, Bot, User } from "lucide-react";
import { getUploadErrorMessage, uploadGeminiImage } from "@/app/frontendLib/upload/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AiAnalysis, FetchData } from "@/app/frontendLib/ai/ai";

export default function Dashboard() {
  const { user } = useUserState();
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [geminiData, setGeminiData] = useState<{
    text: string;
    file: { url: string; mimeType: string };
  }>({
    text: "",
    file: { url: "", mimeType: "" },
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobileWidth = () => setIsMobile(window.innerWidth < 768);
    checkMobileWidth();
    window.addEventListener("resize", checkMobileWidth);
    return () => window.removeEventListener("resize", checkMobileWidth);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["AIData"],
    queryFn: FetchData,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.message]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploaded = await uploadGeminiImage(file);

      setGeminiData((prev) => ({
        ...prev,
        file: {
          url: uploaded.url,
          mimeType: uploaded.mimeType,
        },
      }));
      toast.success("Image uploaded successfully");
    } catch (err: unknown) {
      toast.error(getUploadErrorMessage(err, "Failed to upload image"));
    } finally {
      setIsUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: AiAnalysis,
    onSuccess: () => {
      toast.success("Analysis complete!");
      setGeminiData({ text: "", file: { url: "", mimeType: "" } });
      queryClient.invalidateQueries({ queryKey: ["AIData"] });
    },
    onError: (err) => {
      toast.error("Failed to analyze image. Please try again.");
    },
  });

  const submitImage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!geminiData.text && !geminiData.file.url) {
      toast.error("Please enter a question or upload an image.");
      return;
    }
    mutation.mutate(geminiData);
  };

  const displayName = user?.username || "Back";

  const renderAnalyzerUI = () => (
    <div className="relative flex h-full flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
      {/* Glow effect in top corner */}
      <div className="absolute top-0 right-0 -z-10 h-32 w-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-gray-400 to-teal-400 text-white shadow-md shadow-emerald-500/20">
            <img src="/gemini.webp" alt="gemini image"></img>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                AI Image Analyzer
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload visuals and extract instant AI insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-500" />
            <p className="text-xs font-medium text-slate-400">Loading analysis history...</p>
          </div>
        ) : data?.message && data.message.length > 0 ? (
          <div className="space-y-6 max-h-600 overflow-y-auto">
            {data.message.map((item: any, idx: number) => (
              <div key={idx} className="space-y-3">
                {/* User Prompt Bubble */}
                {(item.text || item.file?.url) && (
                  <div className="flex items-start justify-end gap-2.5 pl-8">
                    <div className="flex flex-col items-end gap-2 max-w-[85%]">
                      {item.file?.url && (
                        <div className="relative h-36 w-36 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md transition-transform hover:scale-[1.02]">
                          <Image
                            src={item.file.url}
                            fill
                            className="object-cover"
                            alt="Query attachment"
                          />
                        </div>
                      )}
                      {item.text && (
                        <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/10">
                          {item.text}
                        </div>
                      )}
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <User size={16} />
                    </div>
                  </div>
                )}

                {/* AI Response Bubble */}
                {item.response && (
                  <div className="flex items-start gap-2.5 pr-8">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <Bot size={16} />
                    </div>
                    <div className="flex-1 rounded-2xl rounded-tl-sm border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                      <div className="max-h-[300px] overflow-y-auto pr-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {item.response}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-8 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-500 mb-4 shadow-inner">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Ready to Analyze
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Upload an image or send a prompt below to initiate intelligent vision analysis.
            </p>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-md space-y-3">
        {/* Attachment Pill */}
        {geminiData.file.url && (
          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/30 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="truncate max-w-[200px]">Image attached</span>
              <button
                type="button"
                onClick={() =>
                  setGeminiData((p) => ({
                    ...p,
                    file: { url: "", mimeType: "" },
                  }))
                }
                className="rounded-full p-0.5 hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={submitImage} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about the image..."
            value={geminiData.text}
            onChange={(e) =>
              setGeminiData({ ...geminiData, text: e.target.value })
            }
            className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10"
          />

          <label className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center">
            {isUploading ? (
              <Loader2 size={18} className="animate-spin text-emerald-500" />
            ) : (
              <ImageIcon size={18} />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
              disabled={isUploading}
            />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending || isUploading}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3 text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col p-4 sm:p-6 md:p-8 gap-6 bg-gradient-to-br from-slate-50 via-slate-100/50 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{displayName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Here is what is happening across your personal workspaces today.
          </p>
        </div>
      </div>

      <hr className="border-slate-200/60 dark:border-slate-800/80 w-full" />

      {/* Main Workspace Layout */}
      <div className="w-full flex-1 min-h-[calc(100vh-220px)]">
        {isMobile ? (
          <div className="flex flex-col gap-6 w-full">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xl shadow-slate-200/40 dark:shadow-none">
              <TaskOverview />
            </div>
            <div className="min-h-[550px]">
              {renderAnalyzerUI()}
            </div>
          </div>
        ) : (
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none bg-white/50 dark:bg-slate-900/50 min-h-[680px]"
          >
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-6 overflow-y-auto">
                <TaskOverview />
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="bg-slate-200/60 dark:bg-slate-800 hover:bg-emerald-500 transition-colors w-1.5"
            />

            <ResizablePanel defaultSize={50} minSize={30}>
              {renderAnalyzerUI()}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}

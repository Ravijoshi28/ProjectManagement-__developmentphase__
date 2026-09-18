"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TaskOverview from "./TaskOverview";
import { useUserState } from "@/app/zustand/userState";
import {
  Send,
  Image as ImageIcon,
  Loader2,
  X,
  ArrowUpRight,
  Bot,
  User,
} from "lucide-react";
import {
  getUploadErrorMessage,
  uploadGeminiImage,
} from "@/app/frontendLib/upload/upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AiAnalysis, FetchData } from "@/app/frontendLib/ai/ai";

export default function Dashboard() {
  const { user } = useUserState();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const [geminiData, setGeminiData] = useState<{
    text: string;
    file: { url: string; mimeType: string };
  }>({
    text: "",
    file: { url: "", mimeType: "" },
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["AIData"],
    queryFn: FetchData,
  });

  useEffect(() => {
    const container = chatEndRef.current;
    if (container) container.scrollTop = container.scrollHeight;
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
    onError: () => {
      toast.error("Failed to analyze image. Please try again.");
    },
  });

  const submitImage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mutation.isPending || isUploading) return;
    if (!geminiData.text.trim() && !geminiData.file.url) {
      toast.error("Please enter a question or upload an image.");
      return;
    }

    mutation.mutate(geminiData);
  };

  const displayName = user?.username || "User";

  const renderAnalyzerUI = () => (
    <div className="relative flex h-[620px] max-h-[80dvh] min-h-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted p-2 text-primary">
            <Image
              src="/gemini.webp"
              height={200}
              width={200}
              alt="gemini image"
            ></Image>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                AI Image Analyzer
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A fresh perspective on your images and ideas
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div
        ref={chatEndRef}
        className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6"
        aria-live="polite"
        aria-busy={isLoading || mutation.isPending}
      >
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
            <p className="text-xs font-medium text-slate-400">
              Loading analysis history...
            </p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <p>Could not load your analysis history.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 font-semibold text-primary underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : data?.message && data.message.length > 0 ? (
          <div className="space-y-6">
            {data.message.map(
              (
                item: {
                  text?: string;
                  file?: { url?: string };
                  response?: string;
                },
                idx: number,
              ) => (
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
                          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-600/10">
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
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <Bot size={16} />
                      </div>
                      <div className="min-w-0 flex-1 rounded-xl rounded-tl-sm border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                          {item.response}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-4 shadow-inner">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              What would you like to explore?
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Attach a screenshot, review a design, or ask a question. Start
              with an image or a few words.
            </p>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 p-4 backdrop-blur-md space-y-3">
        {/* Attachment Pill */}
        {geminiData.file.url && (
          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/80 dark:bg-indigo-950/30 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <span className="truncate max-w-[200px]">Image attached</span>
              <button
                type="button"
                aria-label="Remove attached image"
                onClick={() =>
                  setGeminiData((p) => ({
                    ...p,
                    file: { url: "", mimeType: "" },
                  }))
                }
                className="rounded-full p-0.5 hover:bg-indigo-200/50 dark:hover:bg-indigo-900/50 transition-colors"
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
            aria-label="Your question"
            disabled={mutation.isPending}
            placeholder="Ask about the image..."
            value={geminiData.text}
            onChange={(e) =>
              setGeminiData({ ...geminiData, text: e.target.value })
            }
            className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all duration-200 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
          />

          <label
            aria-label="Attach an image"
            className="relative cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            {isUploading ? (
              <Loader2 size={18} className="animate-spin text-indigo-500" />
            ) : (
              <ImageIcon size={18} />
            )}
            <input
              type="file"
              accept="image/*"
              aria-label="Attach an image"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFile}
              disabled={isUploading || mutation.isPending}
            />
          </label>

          <button
            type="submit"
            aria-label="Send for analysis"
            disabled={
              mutation.isPending ||
              isUploading ||
              (!geminiData.text.trim() && !geminiData.file.url)
            }
            className="rounded-2xl bg-primary p-3 text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
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
    <div className="page-shell space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Your workspace, at a glance
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl break-words">
            Welcome back, {displayName}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Pick up where you left off and keep your team moving.
          </p>
        </div>
        <Link
          href="/main/project"
          className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          View projects <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <TaskOverview />
        <section className="min-w-0" aria-label="AI image analysis">
          {renderAnalyzerUI()}
        </section>
      </div>
    </div>
  );
}

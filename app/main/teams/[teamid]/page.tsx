import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "./chatMessage";
import ChatInput from "./chatInput";
import MobileProjectSelector from "../mobile-project-selector";

interface ProjectProps {
  params: Promise<{ teamid: string }>;
}

export default async function TeamId({ params }: ProjectProps) {
  const { teamid } = await params;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-border/60 bg-card px-4 py-4  sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
              TC
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight sm:text-lg">
                Team Chat
              </h1>
              <p className="max-w-[250px] truncate text-xs text-muted-foreground sm:max-w-none">
                Project conversation
              </p>
            </div>
          </div>
          <MobileProjectSelector />
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
            <ChatMessages projectId={teamid} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-border/60 bg-card p-3  sm:p-4">
        <div className="mx-auto max-w-4xl">
          <ChatInput key={teamid} projectId={teamid} />
        </div>
      </div>
    </div>
  );
}

import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "./chatMessage";
import ChatInput from "./chatInput";

interface ProjectProps {
  params: Promise<{ teamid: string }>;
}

export default async function TeamId({
  params,
}: ProjectProps) {
  const { teamid } = await params;

 

  

  return (
    <div className="flex flex-col h-full w-full bg-background">
  {/* Header */}
  <div className="border-b px-6 py-4 shrink-0">
    <h1 className="text-xl font-semibold">Team Chat</h1>
    <p className="text-sm text-muted-foreground">
      Team ID: {teamid}
    </p>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-hidden">
    <ScrollArea className="h-full w-full">
      <div className="p-6">
        <ChatMessages  projectId={teamid}/>
      </div>
    </ScrollArea>
  </div>

  {/* Input */}
  <div className="border-t p-4 shrink-0">
    <ChatInput projectId={teamid} />
  </div>
</div>
  );
}
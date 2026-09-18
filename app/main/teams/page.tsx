import { MessageCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MobileProjectSelector from "./mobile-project-selector";
export default function TeamsHomePage() {
  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-6 sm:p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-primary">
          <MessageCircle size={30} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Good work starts with a conversation.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Choose a project to share an update, ask a question, or work through
          the details with your team.
        </p>
        <div className="mt-6 flex justify-center md:hidden">
          <MobileProjectSelector />
        </div>
        <Link
          href="/main/project"
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Find your projects <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}

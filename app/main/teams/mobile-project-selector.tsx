"use client";

import { useState } from "react";
import { FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Groups from "./groups";

export default function MobileProjectSelector() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="sm" className="gap-2 rounded-xl bg-white/80 md:hidden" />}>
        <FolderKanban className="h-4 w-4" />
        <span className="hidden min-[380px]:inline">Change project</span>
        <span className="min-[380px]:hidden">Projects</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(88vw,340px)] gap-0 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Choose a project chat</SheetTitle>
          <SheetDescription>Select the project you want to message.</SheetDescription>
        </SheetHeader>
        <Groups onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

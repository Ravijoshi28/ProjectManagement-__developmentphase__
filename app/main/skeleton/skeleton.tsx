import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function ProjectSkeleton() {
  const skeletons = Array.from({ length: 3 }, (_, idx) => (
    <Card
      key={idx}
      className="flex flex-col justify-between border-slate-200/60 bg-white p-5 rounded-xl space-y-4"
    >
      <div className="space-y-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-2">
        <Skeleton className="h-3 w-1/4" />

        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </Card>
  ));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletons}
      </div>
    </div>
  );
}
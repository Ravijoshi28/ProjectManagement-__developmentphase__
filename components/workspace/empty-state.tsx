import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-12 text-center">
      <div className="mb-5 rounded-2xl bg-muted p-4 text-primary">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

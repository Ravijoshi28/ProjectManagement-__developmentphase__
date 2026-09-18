import Groups from "./groups";
export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden">
      <aside
        aria-label="Project conversations"
        className="hidden w-64 shrink-0 border-r border-border bg-card md:block xl:w-72"
      >
        <Groups />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

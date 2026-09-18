import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 py-5 text-xs text-muted-foreground">
        <span>TaskFlow &copy; {new Date().getFullYear()}</span>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/main/project" className="hover:text-foreground">
            Projects
          </Link>
          <Link href="/main/teams" className="hover:text-foreground">
            Teams
          </Link>
          <Link href="/main/profile" className="hover:text-foreground">
            Account
          </Link>
        </nav>
      </div>
    </footer>
  );
}

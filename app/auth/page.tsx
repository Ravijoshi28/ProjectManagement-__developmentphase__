import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  MessagesSquare,
  ScanLine,
} from "lucide-react";

export default function ProjectLandingPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/auth"
          className="flex items-center gap-2.5 text-lg font-semibold tracking-tight"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary p-1.5">
            <Image src="/main.png" width={24} height={24} alt="" />
          </span>
          TaskFlow
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-5 text-sm font-medium"
        >
          <a
            href="#workspace"
            className="hidden text-muted-foreground hover:text-foreground sm:inline"
          >
            Your workspace
          </a>
          <Link
            href="/auth/login"
            className="rounded-lg border border-border bg-card px-4 py-2 hover:bg-muted"
          >
            Sign in
          </Link>
        </nav>
      </header>
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-20">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-medium text-primary">
              A little structure. A lot more progress.
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
              Great work.
              <br />
              All in one place.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Bring your projects, tasks, and team conversations together. Make
              space for the work that matters.
            </p>
            <Link
              href="/auth/signup"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create your workspace <ArrowRight size={17} />
            </Link>
          </div>
        </section>
        <figure className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-20">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <Image
              src="/workspace-preview.png"
              width={1600}
              height={820}
              sizes="(max-width: 1280px) 100vw, 1216px"
              alt="TaskFlow board with sample tasks organized into To do, In progress, Review, and Completed columns."
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-3 text-xs text-muted-foreground">
            A look inside TaskFlow. Example workspace shown.
          </figcaption>
        </figure>
        <section id="workspace" className="border-y border-border bg-card">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Less chasing updates.
                <br />
                More moving forward.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                From the first idea to the final task, keep the details and the
                people behind them connected.
              </p>
            </div>
            <div className="divide-y divide-border">
              {[
                {
                  icon: FolderKanban,
                  title: "A clear next step",
                  text: "Create projects, assign tasks, and follow the work from to do to completed.",
                },
                {
                  icon: MessagesSquare,
                  title: "Your team, on the same page",
                  text: "Keep conversations and shared files together in a dedicated chat for each project.",
                },
                {
                  icon: ScanLine,
                  title: "A fresh perspective",
                  text: "Ask questions about your images and explore project knowledge with the AI assistant.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex gap-5 py-6 first:pt-0 last:pb-0"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className="mt-1 shrink-0 text-primary"
                  />
                  <div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-7 text-xs text-muted-foreground sm:px-8">
        <span>TaskFlow &copy; {new Date().getFullYear()}</span>
        <span>A shared space to get things done.</span>
      </footer>
    </div>
  );
}

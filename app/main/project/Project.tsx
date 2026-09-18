"use client";

import React, { useState } from "react";
import { useProjectState } from "@/app/zustand/useProjectState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Folder, Users, Plus, User, Search, ArrowUpRight } from "lucide-react";
import CreateProjectModal from "./createProject";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/app/frontendLib/projectlib/projectapi";
import { PageHeader } from "@/components/workspace/page-header";
import { EmptyState } from "@/components/workspace/empty-state";
import { Input } from "@/components/ui/input";
import AddMember from "./AddMember";
import { useUserState } from "@/app/zustand/userState";

interface ProjectMember {
  username: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  about: string;
  ownerId: string;
  image: string | null;
  members?: ProjectMember[];
}

export default function Projects() {
  const [search, setSearch] = useState("");
  const { user } = useUserState();
  const { setProjectId } = useProjectState();

  const {
    data: projects = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProject,
    staleTime: 5 * 60 * 1000,
  });

  const skeletons = Array.from({ length: 3 }, (_, idx) => (
    <Card
      key={idx}
      className="flex flex-col justify-between border-border bg-card p-5 rounded-xl space-y-4"
    >
      <div className="space-y-3">
        <Skeleton className="h-10 w-10 rounded-lg bg-muted" />
        <Skeleton className="h-5 w-2/3 bg-muted" />
        <Skeleton className="h-4 w-full bg-muted" />
        <Skeleton className="h-4 w-5/6 bg-muted" />
      </div>
      <div className="border-t border-border/60 pt-4 space-y-2">
        <Skeleton className="h-3 w-1/4 bg-muted" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-6 rounded-full bg-muted" />
          <Skeleton className="h-6 w-6 rounded-full bg-muted" />
        </div>
      </div>
    </Card>
  ));

  const visibleProjects = projects.filter((project) =>
    `${project.name} ${project.about || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="page-shell">
      <PageHeader
        title="Projects"
        description="A place for every idea, and everyone bringing it to life."
        action={<CreateProjectModal />}
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading your workspace..."
            : `${projects.length} ${projects.length === 1 ? "project" : "projects"} in your workspace`}
        </p>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search projects"
            placeholder="Search projects..."
            className="h-10 bg-card pl-9"
          />
        </div>
      </div>
      {error ? (
        <EmptyState
          icon={Folder}
          title="Projects could not be loaded"
          description="Try again to reconnect to your workspace."
          action={
            <button
              onClick={() => refetch()}
              className="text-sm font-medium text-primary"
            >
              Try again
            </button>
          }
        />
      ) : isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {skeletons}
        </div>
      ) : visibleProjects.length === 0 ? (
        <EmptyState
          icon={Folder}
          title={search ? "No matching projects" : "Start something together"}
          description={
            search
              ? "Try a different project name or description."
              : "Create your first project, invite your team, and turn ideas into tasks."
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5 items-stretch">
          {visibleProjects.map((project) => (
            <Card
              key={project._id}
              className="group flex flex-col justify-between transition-all duration-200 hover:border-primary/30 border-border bg-card rounded-2xl overflow-hidden min-h-[240px]"
            >
              <CardHeader className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  {/* Visual Icon Box */}
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 text-muted-foreground transition-colors">
                    <Folder className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    <Link
                      href={`/main/project/${project._id}`}
                      onClick={() => setProjectId(project._id)}
                      className="flex items-center justify-between gap-3 break-words hover:text-primary transition-colors"
                    >
                      {project.name}
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </CardTitle>

                  <CardDescription className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px]">
                    {project.about ||
                      "No description provided for this project."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-0">
                <div className="border-t border-border/60 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Team Members</span>
                  </div>

                  {/* Clean Horizontal Avatar Layout Wrapper */}
                  <div className="flex items-center flex-wrap gap-2 mt-1">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {project.members?.slice(0, 4).map((member, mIdx) => {
                        const initials = member?.username ? (
                          member.username.substring(0, 2).toUpperCase()
                        ) : (
                          <User />
                        );
                        return (
                          <div
                            key={mIdx}
                            title={member.username}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground ring-2 ring-white select-none cursor-default"
                          >
                            {initials}
                          </div>
                        );
                      })}
                    </div>

                    {/* Empty State Notification */}
                    {(!project.members || project.members.length === 0) && (
                      <span className="text-xs text-muted-foreground italic font-medium">
                        No members added
                      </span>
                    )}

                    {/* Quick Action Add Button Trigger Node */}
                    {user?.id === project.ownerId && (
                      <AddMember
                        projectId={project._id}
                        trigger={
                          <p className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-300 bg-card text-muted-foreground hover:text-slate-600 hover:border-slate-400 transition-all">
                            {" "}
                            <Plus size={12} />
                          </p>
                        }
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

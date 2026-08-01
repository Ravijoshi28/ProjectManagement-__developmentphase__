"use client";

import React, { useEffect } from "react";
import { useProjectState } from "@/app/zustand/useProjectState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Folder, Users, Plus, User } from "lucide-react";
import CreateProjectModal from "./createProject";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/app/frontendLib/projectlib/projectapi";
import AddMember from "./AddMember";
import { useUserState } from "@/app/zustand/userState";


interface ProjectMember {
  username:string,
  email:string,
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
  const { user } = useUserState();
  const { setProjectId } = useProjectState();

  console.log(user)
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProject,
    staleTime: 5 * 60 * 1000,
  });

  console.log(projects);

  

  const skeletons = Array.from({ length: 3 }, (_, idx) => (
    <Card key={idx} className="flex flex-col justify-between border-slate-200/60 bg-white p-5 rounded-xl space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-10 w-10 rounded-lg bg-slate-100" />
        <Skeleton className="h-5 w-2/3 bg-slate-100" />
        <Skeleton className="h-4 w-full bg-slate-100" />
        <Skeleton className="h-4 w-5/6 bg-slate-100" />
      </div>
      <div className="border-t border-slate-100 pt-4 space-y-2">
        <Skeleton className="h-3 w-1/4 bg-slate-100" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-6 rounded-full bg-slate-100" />
          <Skeleton className="h-6 w-6 rounded-full bg-slate-100" />
        </div>
      </div>
    </Card>
  ));

  if (error)  {
   return <p>Create your first Project</p>
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48 bg-slate-100" />
          <Skeleton className="h-4 w-80 bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletons}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header Section */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Consumer Projects</h2>
        <p className="text-slate-500 text-sm">
          All your projects available in one centralized workspace.
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {projects?.map((project) => (
          <Card 
            key={project._id} 
            className="group flex flex-col justify-between transition-all duration-200 hover:shadow-md border-slate-200/80 bg-white rounded-xl overflow-hidden min-h-[250px]"
          >
            <CardHeader className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                {/* Visual Icon Box */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 transition-colors">
                  <Folder className="h-4 w-4" />
                </div>
              </div>
              
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold tracking-tight text-slate-900">
                  <Link 
                    href={`/main/project/${project._id}`}
                    onClick={() => setProjectId(project._id)}
                    className="hover:text-blue-600 transition-colors block"
                  >
                    {project.name}
                  </Link> 
                </CardTitle>
                
                <CardDescription className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[32px]">
                  {project.about || "No description provided for this project."}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="px-5 pb-5 pt-0">
              <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                  <Users className="h-3 w-3" />
                  <span>Team Members</span>
                </div>
               
                {/* Clean Horizontal Avatar Layout Wrapper */}
                <div className="flex items-center flex-wrap gap-2 mt-1">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {project.members?.slice(0, 4).map((member, mIdx) => {
                      const initials = member?.username ? member.username.substring(0, 2).toUpperCase() : (<User/>);
                      return (
                        <div 
                          key={mIdx} 
                          title={member.username}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 ring-2 ring-white select-none cursor-default"
                        >
                          {initials}
                        </div>
                      );
                    })}
                  </div>

                  {/* Empty State Notification */}
                  {(!project.members || project.members.length === 0) && (
                    <span className="text-xs text-slate-400 italic font-medium">No members added</span>
                  )}

                  {/* Quick Action Add Button Trigger Node */}
                  {user?.id === project.ownerId && (
                    <AddMember
                      projectId={project._id}
                      trigger={
                        <p
               className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-slate-300 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-all"
>                      <Plus size={12} />

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
       
    </div>
  );
}
import { verifyToken } from "@/app/lib/verifyToken";
import { projects } from "@/app/Models/Project";
import { tasks } from "@/app/Models/Tasks";
import { TaskSchema } from "@/app/schema/zod";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest,{params}:{params:Promise<{projectId:string}>}) {
   
    const {projectId}=await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
        return Response.json(
            { message: "Not authorised" },
            { status: 401 }
        );
    }
    
    try {
        const user = verifyToken(token);
        const body = TaskSchema.parse(await req.json());

        const project = await projects.findOne({_id:projectId});
        
        if (!project) {
            return Response.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }
        
               if (user.id !== project.ownerId) {
            return Response.json(
                { message: "You are not the admin" },
                { status: 403 }
            );
        }
        
        
      const task=  await tasks.insertOne({
          _id: crypto.randomUUID(),
          projectId,
          title: body.title,
          description: body.description,
          dueDate: body.dueDate,
          status: body.status,
          priority: body.priority,
          assignedTo: null,
          watchers: null,
          completedAt: body.dueDate
      });
        
       

        return Response.json(
            { message: "Task created successfully", task },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return Response.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
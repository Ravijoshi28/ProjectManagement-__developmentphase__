import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";
import Project from "@/app/Models/Project";
import Tasks from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest,{params}:{params:Promise<{projectId:string}>}) {
    await ConnectDb();
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
        const body = await req.json();

        const project = await Project.findById(projectId);
        
        if (!project) {
            return Response.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }
        
               if (user.id !== project.ownerId.toString()) {
            return Response.json(
                { message: "You are not the admin" },
                { status: 403 }
            );
        }
        
        
        const newTask = new Tasks({
            projectId,
            title: body.title,
            description: body.description,
            dueDate: body.dueDate,
            status: body.status,
            priority: body.priority,
        });
        
        await newTask.save();

        return Response.json(
            { message: "Task created successfully", task: newTask },
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
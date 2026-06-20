import ConnectDb from "@/app/lib/mongodb";
import Tasks from "@/app/Models/Tasks";
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{projectId:string}>}){
   await ConnectDb();
    const cookieExtraxt=await cookies();

    const token=cookieExtraxt.get("token")?.value;
    if(!token){
       return Response.json({message:"User is not authorized"},{status:401})
    }
    const {projectId}=await params;
    try {
        const tasks=await Tasks.find({projectId:projectId});

        if(tasks.length==0){
            return Response.json({message:"There are no task related to this Project"},{status:200});
        }
        return Response.json({data:tasks},{status:200});

        
    } catch (error) {
       return Response.json({message:"error in creating Task...",error},{status:404})
    }
}
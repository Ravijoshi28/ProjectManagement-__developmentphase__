import { verifyToken } from "@/app/lib/verifyToken";
import { pMembers } from "@/app/Models/PMember";
import { tasks } from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const cookieExt=await cookies();
    const token=cookieExt.get("token")?.value;
    if(!token){
       return Response.json({message:"user not authorised token"},{status:201})
    }
    const user=verifyToken(token);
     if(!user.id){
       return Response.json({message:"user not authorised"},{status:201})
    }

    try {
        const projects = await pMembers.find({ userId: user.id },{projection:{
                projectId:1,_id:1
        }}).toArray();

const projectIds = projects.map((p) => p.projectId);
const taskList = await tasks.find(
  {
    projectId: { $in: projectIds },
  },
  {
    sort: { createdAt: -1 },
    limit: 5,
  }
).toArray();
  



 return Response.json({message:taskList},{status:200})
        
    } catch (error) {
        NextResponse.json({message:error},{status:400})
    }
}

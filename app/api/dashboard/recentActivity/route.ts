import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";
import PMember from "@/app/Models/PMember";
import Tasks from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    await ConnectDb();
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
        const projects = await PMember.find({ userId: user.id }).select("projectId -_id");

const projectIds = projects.map((p) => p.projectId);
const tasks = await Tasks.find({
  projectId: { $in: projectIds },
})
  .sort({ createdAt: -1 }) // newest first
  .limit(5);



 return Response.json({message:tasks},{status:200})
        
    } catch (error) {
        console.log(error);
        NextResponse.json({message:error},{status:400})
    }
}
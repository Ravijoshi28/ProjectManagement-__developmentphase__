import { verifyToken } from "@/app/lib/verifyToken";
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
    const id=user.id

    const now = new Date();

const nextWeek = new Date();
nextWeek.setDate(now.getDate() + 7);
    try {
      const taskList = await tasks.find({
  assignedTo:id,
  dueDate: {
    $gte: now,
    $lte: nextWeek,
  },
},{sort:{ dueDate: 1 },limit:5
}).toArray();

    if(taskList.length===0){
         return Response.json({message:[]},{status:200})

    }

   
 return Response.json({message:taskList},{status:200})
        
    } catch (error) {
        NextResponse.json({message:error},{status:400})
    }
}

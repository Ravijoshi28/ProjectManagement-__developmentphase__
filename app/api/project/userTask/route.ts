import { verifyToken } from "@/app/lib/verifyToken";
import { tasks } from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){

    try {
        const cookieExt=await cookies()
        const token=cookieExt.get("token")?.value;

    if(!token){
        return Response.json({message:"User is not Authorised"},{status:401})
    }
    const user=verifyToken(token);
        const id=user.id;

        const taskList=await tasks.find({assignedTo:id}).toArray();

        if(taskList.length==0){
                return Response.json({message:[]},{status:200})
        }
         return Response.json({message:taskList},{status:200})

    } catch (error) {
                return Response.json({message:"Something went wrong while fetching data"},{status:500})

    }

}
import { verifyToken } from "@/app/lib/verifyToken";
import Tasks from "@/app/Models/Tasks";
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

        const tasks=await Tasks.find({assignedTo:id});

        if(tasks.length==0){
                return Response.json({message:"No data to fetch"},{status:200})
        }
         return Response.json({message:tasks},{status:200})

    } catch (error) {
                return Response.json({message:"Something went wrong while fetching data"},{status:500})

    }

}
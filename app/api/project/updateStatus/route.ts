import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";
import Tasks from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async  function PATCH(req:NextRequest){
    await ConnectDb();
    const cookieExtract=await cookies();
    const token=cookieExtract.get("token")?.value;

    if(!token){
        return Response.json({message:"user is not authorised"},{status:401});
    }
  
    const user=verifyToken(token);
      if(!user){
        return Response.json({message:"user is not authorised"},{status:401});
    }
    

    try {
         const body = await req.json();
        const taskId=await req.nextUrl.searchParams.get("task");

        const update=await Tasks.findByIdAndUpdate(taskId,
            {
                status:body.status
            })


            return Response.json({message:"Task updated successfully"},{status:200})

    } catch (error) {
        console.log(error)
        return Response.json({message:"user is not authorised"},{status:401});

    }

}
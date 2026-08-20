import { verifyToken } from "@/app/lib/verifyToken";
import { tasks } from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async  function PATCH(req:NextRequest){
    const cookieExtract=await cookies();
    const token=cookieExtract.get("token")?.value;

    if(!token){
        return Response.json({message:"user is not authorised"},{status:401});
    }
  
    const user=verifyToken(token);
      if(!user){
        return Response.json({message:"user is not authorised"},{status:401});
    }
    const id=user.id;
    

    try {
         const body = await req.json();
        const taskId=await req.nextUrl.searchParams.get("task");

         if(!taskId){
        return Response.json({message:"no task available"},{status:401});
    }

       await tasks.findOneAndUpdate({_id:taskId},
            {
              $set :{
                    status:body.status
              } 
            })


            return Response.json({message:"Task updated successfully"},{status:200})

    } catch (error) {
        return Response.json({message:"user is not authorised"},{status:401});

    }

}

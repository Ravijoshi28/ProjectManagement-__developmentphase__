import { verifyToken } from "@/app/lib/verifyToken";
import { tasks } from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { after } from "node:test";

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

      const task_to_update= await tasks.findOneAndUpdate({_id:taskId},
            {
              $set :{
                    status:body.status
              } ,
              
            },{
                returnDocument:"after"
            })

            const task = {
          _id:task_to_update?._id ,
          projectId:task_to_update?.projectId,
          title: task_to_update?.title,
          description: task_to_update?.description,
          dueDate: task_to_update?.dueDate,
          status: task_to_update?.status,
          priority: task_to_update?.priority,
          assignedTo: task_to_update?.assignedTo,
          watchers: task_to_update?.watchers,
          completedAt: task_to_update?.completedAt
      };

             const ragTask = {
              task_id: task._id,
              project_id: task.projectId,
            
              content: `
            Title: ${task.title}
            Description: ${task.description}
            Status: ${task.status}
            Priority: ${task.priority}
            Due Date: ${task.dueDate}
            assignedTo:${task.assignedTo}
              `.trim(),
            
              status: task.status,
              priority: task.priority,
              due_date: task.dueDate,
            };
                    
                const url = process.env.RAG_URL!;
            
            await fetch(`${url}/ingestion`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({tasks:[ragTask]}),
            });


            return Response.json({message:"Task updated successfully"},{status:200})

    } catch (error) {
        return Response.json({message:"user is not authorised"},{status:401});

    }

}

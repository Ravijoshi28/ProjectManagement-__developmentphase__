
import { pMembers } from "@/app/Models/PMember";
import { tasks } from "@/app/Models/Tasks";
import { users } from "@/app/Models/User";
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export async function GET(req:NextRequest,{params}:{params:Promise<{projectId:string}>}){
  
    const cookieExtraxt=await cookies();

    const token=cookieExtraxt.get("token")?.value;
    if(!token){
       return Response.json({message:"User is not authorized"},{status:401})
    }
    const {projectId}=await params;
    try {
        const task=await tasks.find({projectId:projectId}).toArray();

        if(task.length==0){
            return Response.json({message:"There are no task related to this Project"},{status:200});
        }
        const members=await pMembers.find({projectId:projectId}).toArray();
       const userIds = members.map((m) => m.userId);

            const usersList = await users.find({
            _id: { $in: userIds },
            }).toArray();     
          
      const tasksWithMembers = task.map((task) => ({
  ...task,
  members: usersList.map((user) => ({
    _id: user._id,
    username: user.username,
  })),
}));
        return Response.json({data:tasksWithMembers,},{status:200});

        
    } catch (error) {
       return Response.json({message:"error in getting Task...",error},{status:404})
    }
}
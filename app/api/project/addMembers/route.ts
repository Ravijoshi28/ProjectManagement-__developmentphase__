import { verifyToken } from "@/app/lib/verifyToken";
import { notifications } from "@/app/Models/Notifications";
import { pMembers } from "@/app/Models/PMember";
import { projects } from "@/app/Models/Project";
import { users } from "@/app/Models/User";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest){
    
    const cookieExtract=await cookies();
    const token=cookieExtract.get("token")?.value;
    if(!token){
        return Response.json({message:"User is not authorized"})
    }
    const user=verifyToken(token);
    const id=user.id;
    if(!user){
 return Response.json({message:"user is not authirised add members.. "},{status:403});    }

            try {
                
                 const projectId=req.nextUrl.searchParams.get("project");

            if (!projectId) {
        return Response.json(
            { message: "Project ID is required" },
            { status: 400 }
            );
        }

        const project = await projects.findOne({_id:projectId});

        if (!project) {
            console.log("no project")
            return Response.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }
      
        if(user.id!==project.ownerId){
            return Response.json({message:"user is not authirised add members.. "},{status:403});
        }

        const formdata=await req.json();
        
        const userIds = formdata.addedEmail.map(
            (f: { id: string }) => f.id
        );
        
       const existingMembers = await pMembers.find(
  {
    projectId,
    userId: { $in: userIds },
  },
  {
    projection: {
      userId: 1,
    },
  }
).toArray();

        const existingUserIds = new Set(
        existingMembers.map((m) => m.userId)
        );

        const newMembers = formdata.addedEmail.filter(
        (f: { id: string }) =>
            !existingUserIds.has(f.id)
        );

                if (newMembers.length > 0) {
        await pMembers.insertMany(
            newMembers.map((f: { id: string }) => ({
            projectId,
            userId: f.id,
            role: "member",
            }))
        );
        }

        const username=await users.findOne( {_id:id});
        
        await notifications.insertMany(
  formdata.addedEmail.map((f: { id: string }) => ({
    senderId: user.id,
    sender: username?.username,

    userId: f.id,

    title: "Added to Project",
    message: `${username?.username} added you to ${project.name}`,
    type: "project_invite",
    projectId,
  }))
);
       

        return Response.json({message:"User added successfully"},{status:200});

            } catch (error) {
               console.log(error)
                 return Response.json({message:`error in server ${error}`},{status:403});
            }

       


}
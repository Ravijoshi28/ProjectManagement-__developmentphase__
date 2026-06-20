import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";

import PMember from "@/app/Models/PMember";
import Project from "@/app/Models/Project";
import User from "@/app/Models/User";
import { cookies } from "next/headers";



export async function GET(req:Request){
    await ConnectDb()
        try{
            const cookieStore = await cookies();
            
            const token= cookieStore.get("token")?.value;
            
            if(!token){
                return Response.json({message:"user not authorized..."},{status:401});
            }
            console.log(Project,User)
            const decode = verifyToken(token);
            const id= decode?.id
           
            const projects=await PMember.find({userId:id}).populate("projectId")
            const projectIds = projects.map((p) => p.projectId);

            const members = await PMember.find({
            projectId: { $in: projectIds },
            }).populate("userId","image name");
            
            const result = projects.map((p) => {
            const project = p.projectId;
             return {
                ...project.toObject(),
                 members: members.filter(
                 (m) => m.projectId.toString() === project._id.toString()
                    ),
                   };
                 });
              
    
            return Response.json({projects:result},{status:200});
        }
        catch(error){
            console.log(error)
            
            return Response.json({message:"error in fetching projects"},{status:400})
        }

}

import { verifyToken } from "@/app/lib/verifyToken";
import { pMembers } from "@/app/Models/PMember";
import { projects } from "@/app/Models/Project";


import { cookies } from "next/headers";



export async function GET(req:Request){
   
        try{
            const cookieStore = await cookies();
            
            const token= cookieStore.get("token")?.value;
            
            if(!token){
                return Response.json({message:"user not authorized..."},{status:401});
            }
        
            const decode = verifyToken(token);
            const id= decode?.id
           
            const memberShip=await pMembers.find({userId:id}).toArray();
            const projectId=memberShip.map((m)=>m.projectId);

            const result=await Promise.all(projectId.map((id)=>
            projects.findOne({_id:id})));

            
            

           
              
    
            return Response.json({projects:result},{status:200});
        }
        catch(error){
            console.log(error)
            
            return Response.json({message:"error in fetching projects"},{status:400})
        }

}
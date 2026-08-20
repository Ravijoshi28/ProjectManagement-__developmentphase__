import { verifyToken } from "@/app/lib/verifyToken";
import { pMembers } from "@/app/Models/PMember";
import { projects } from "@/app/Models/Project";
import { ProjectSchema } from "@/app/schema/zod";
import { cookies } from "next/headers";


export async function POST(req:Request,){

    const cookieExt=await cookies()
    const token=cookieExt.get("token")?.value;

    if(!token) {
        return Response.json({message:"user is not authorised..."},{status:401});
    }
    
    const decode=verifyToken(token);
    const id=decode?.id;


   try{
        const body=ProjectSchema.parse(  await req.json());

        if(!body.name){
            return Response.json({message:"Please provide Project with a name"},{status:400});
        }
        
        

      const project=crypto.randomUUID()

      try{
        await  projects.insertOne({
        _id:project,
            name:body.name,
            ownerId:id,
            about:body?.about,
            image:body?.image ?? null,
            memberId:[id],
            createdAt:new Date()
        })

      

          
     await pMembers.insertOne({
        _id:crypto.randomUUID(),
          projectId:project,
            userId:id,
            role:"owner",
            joinedAt:new Date()
     })
        
      }
      catch(error){
         return Response.json({message:"Project creation failed please try again",error},{status:500});
      }
        // await NewMember.save()
          return Response.json({message:"Project successfully created"},{status:201});
   }
   catch(error){
           return Response.json({message:"Project creation failed please try again",error},{status:500});
   }

}

import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";
import Project from "@/app/Models/Project";
import PMember from "@/app/Models/PMember";
import { cookies } from "next/headers";


export async function POST(req:Request,){

    await ConnectDb();
    const cookieExt=await cookies()
    const token=cookieExt.get("token")?.value;

    if(!token) {
        return Response.json({message:"user is not authorised..."},{status:401});
    }
    
    const decode=verifyToken(token);
    const id=decode?.id;


   try{
        const body=await req.json();

        if(!body.name){
            return Response.json({message:"Please provide Project with a name"},{status:400});
        }
        
        

        const newProject= new Project({
            name:body.name,
            ownerId:id,
            about:body?.about
        })

        await newProject.save();

          
        const NewMember=new PMember({
            projectId:newProject._id,
            userId:id,
            role:"admin"
        })
        
        await NewMember.save()
          return Response.json({message:"Project successfully created"},{status:201});
   }
   catch(error){
       
           return Response.json({message:"Project creation failed please try again"},{status:500});
   }

}
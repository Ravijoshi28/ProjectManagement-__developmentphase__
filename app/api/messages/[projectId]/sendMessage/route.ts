import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";
import Message from "@/app/Models/Message";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    await ConnectDb();
    const cookiesgen=await cookies();
    
    const token=cookiesgen.get("token")?.value;
    if(!token){
        return Response.json({message:"Unauthorised User"},{status:401});
    }
    const user=verifyToken(token);
    if(!user.id){
         return Response.json({message:"Unauthorised User"},{status:401});
    }
   

    try {
        const body=await req.json();
        const {projectId}= await params;

        if(!projectId || (!body.message ||( body.message.content.trim() && body.message.file.trim())) === ""){
         return Response.json({message:"no project selected or message empty"},{status:400});
        }
      
        
        const newMessage=new Message({
            content:body.content,
            senderId:user.id,
            projectId:projectId,
            type:body.type,
            file:{
                url:body.file.url,
                mimetype:body.file.mimetype
            }
        })
        
        await newMessage.save();

        
        return Response.json({message:"Message sended"},{status:200})

    } catch (error) {
        console.log(error)
        return Response.json({message:"something went wrong...cannot send message"},{status:500})
    }
}
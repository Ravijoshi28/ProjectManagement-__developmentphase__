
import { verifyToken } from "@/app/lib/verifyToken";
import { messages } from "@/app/Models/Message";

import { MessageSchema } from "@/app/schema/zod";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    
    const cookiesgen=await cookies();
    
    const token=cookiesgen.get("token")?.value;
    if(!token){
        return Response.json({message:"Unauthorised User"},{status:401});
    }
    const user=verifyToken(token);
    const id=user.id;
    if(!id){
         return Response.json({message:"Unauthorised User"},{status:401});
    }
   

    try {
        const body=MessageSchema.parse(await req.json());
        const {projectId}= await params;

        if(!projectId ||  (body.content.trim() && !body.file) === ""){
         return Response.json({message:"no project selected or message empty"},{status:400});
        }
      
        
        await messages.insertOne({
            _id:crypto.randomUUID(),
             content: body.content,
            senderId: id,
            projectId: projectId,
            type: body.type,
            file: body.file ?? null,
            createdAt:new Date()
        })
       

        
        return Response.json({message:"Message sended"},{status:200})

    } catch (error) {
        console.log(error)
        return Response.json({message:"something went wrong...cannot send message"},{status:500})
    }
}
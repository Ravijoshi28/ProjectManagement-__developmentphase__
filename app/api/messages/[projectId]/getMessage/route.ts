import { verifyToken } from "@/app/lib/verifyToken";
import Message from "@/app/Models/Message";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{projectId:string}}){
 const {projectId}=await params;
 

 const cookieGen=await cookies();
 const token=cookieGen.get("token")?.value;
 if(!token){
    return Response.json({message:"Unauthorised user"},{status:401})
 }
 

 const user=verifyToken(token);
 if(!user.id){
    return Response.json({message:"Unauthorised user"},{status:401})
 }

 try {
    const messages=await Message.find({projectId}).sort({createdAt:1}).populate("senderId", "name image");
    
    return Response.json({messages},{status:200})
 } catch (error) {
    
     return Response.json({message:"something went wrong while fetching the messages"},{status:500})
 }
}
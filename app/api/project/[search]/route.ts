import ConnectDb from "@/app/lib/mongodb";
import User from "@/app/Models/User";
import { Regex } from "lucide-react";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
       await ConnectDb();
    const cookieExt=await cookies();
    const token=cookieExt.get("token")?.value;
    if(!token){
         return Response.json({message:"User not authorised"},{status:401})
    }

    try {
        const email=req.nextUrl.searchParams.get("email");

        if(!email){
      return Response.json({message:"Enter email to find user"},{status:200})
        }

        const users=await User.find({email:{$regex:email,$options:"i"}}).select("name image email").limit(5);
        if(users.length===0){
            return Response.json({message:"No user found"},{status:200});
        }
       
        return Response.json({message:users},{status:200})
    } catch (error) {
        return Response.json({message:"internal server error"},{status:500})
    }
}
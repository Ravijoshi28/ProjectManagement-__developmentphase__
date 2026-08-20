
import { users } from "@/app/Models/User";
import { Regex } from "lucide-react";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
       
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

        const userList=await users.find({email:email},{
            projection:{name:1,image:1,email:1},
                limit:5
        }).toArray()
        if(userList.length===0){
            return Response.json({message:"No user found"},{status:200});
        }
       
        return Response.json({message:userList},{status:200})
    } catch (error) {
        return Response.json({message:"internal server error",error},{status:500})
    }
}

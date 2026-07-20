import { verifyToken } from "@/app/lib/verifyToken";
import { users } from "@/app/Models/User";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(req:NextRequest){
    const cookieExt=await cookies();
    const token=cookieExt.get("token")?.value;
    if(!token){
       return Response.json({message:"user not authorised"},{status:201})
    }
    const user=verifyToken(token);
     if(!user.id){
       return Response.json({message:"user not authorised"},{status:201})
    }

    try{
        const body=await req.json();
        const profile=await users.findOne({_id:user.id});
      
       if (!profile) {
        return Response.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    await users.findOneAndUpdate({
        _id:user.id
    },{
        $set:{
            image:body.image,
            username:body.username
        }
    })

    
        return Response.json({message:"Changes made"},{status:200})
    }
    catch(error){
        console.log(error);
        Response.json({message:error},{status:400})
    }
}
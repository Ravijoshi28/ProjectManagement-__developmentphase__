import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";
import Notifications from "@/app/Models/Notifications";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){

    await ConnectDb()

     const cookieExt = await cookies();
      const token = cookieExt.get("token")?.value;
    
      if (!token) {
        return Response.json(
          { message: "User is not authorised" },
          { status: 401 }
        );
      }
    
      const user = verifyToken(token);
    
      if (!user) {
        return Response.json(
          { message: "User is not authorised" },
          { status: 401 }
        );
      }

      try{
       
        const notifications=await Notifications.find({userId:user.id}).sort({createdAt:-1})

        if(notifications.length===0){
            return Response.json({message:"No Notifications for the user"},{status:200});
        }

        return Response.json({data:notifications},{status:200});


      }
      catch(error){
          console.error("ASSIGN TASK ERROR:", error);

  return Response.json(
    {
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : error,
    },
    { status: 500 }
  );
      }

}
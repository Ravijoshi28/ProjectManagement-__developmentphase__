import { verifyToken } from "@/app/lib/verifyToken";
import { notifications } from "@/app/Models/Notifications";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){

   

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
       
        const notificationList=await notifications.find({userId:user.id}).sort({createdAt:-1}).toArray();

        if(notificationList.length===0){
            return Response.json({data:[],message:"No Notifications for the user"},{status:200});
        }

        return Response.json({data:notificationList},{status:200});


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
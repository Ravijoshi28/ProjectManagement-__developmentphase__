import { verifyToken } from "@/app/lib/verifyToken";
import { tasks } from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "User is not authorized" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);
  const id=user.id;
  console.log("working");
  if (!user) {
    return Response.json(
      { message: "User is not authorized" },
      { status: 401 }
    );
  }

  try {
   
        const taskList=await tasks.find({assignedTo:id}).toArray();

        if(taskList.length===0){
                return Response.json({message:[]},{status:200})
        }
         return Response.json({message:taskList},{status:200})
  } catch (error) {
    console.error("GET ASSIGNED TASKS ERROR:", error);

    return Response.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
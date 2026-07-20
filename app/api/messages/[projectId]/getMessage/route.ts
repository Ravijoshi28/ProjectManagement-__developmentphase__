import { verifyToken } from "@/app/lib/verifyToken";
import { messages } from "@/app/Models/Message";
import { pMembers } from "@/app/Models/PMember";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const cookieGen = await cookies();
  const token = cookieGen.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "Unauthorised user" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);
  const id=user.id;

  if (!user.id) {
    return Response.json(
      { message: "Unauthorised user" },
      { status: 401 }
    );
  }

  try {
      const project=await pMembers.findOne({projectId,userId:id});
      if(!project){
         return Response.json({ data:"u are not the member of the group" }, { status: 200 });
      }

    const messageList = (await messages.find({ projectId:projectId }).sort({createdAt:1}).toArray());

    if(messageList.length===0){
       return Response.json({ message:"be the first one to send message in group",data:[] }, { status: 200 });
    }
   

    return Response.json({ data:messageList }, { status: 200 });
  } catch (error) {
    return Response.json(
      { data: "Something went wrong while fetching the messages" },
      { status: 500 }
    );
  }
}
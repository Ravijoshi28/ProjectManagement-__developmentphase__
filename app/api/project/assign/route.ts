import { verifyToken } from "@/app/lib/verifyToken";
import { notifications } from "@/app/Models/Notifications";
import { projects } from "@/app/Models/Project";
import { tasks } from "@/app/Models/Tasks";
import { users } from "@/app/Models/User";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
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
  const id=user.id;

  try {
    
    const body = await req.json();
    const Task=await tasks.findOne({_id:body.taskId});
      if (!Task) {
  return Response.json(
    { message: "Task not found" },
    { status: 404 }
  );
}
    const project=await projects.findOne({_id:Task.projectId})
  
       if (!project) {
  return Response.json(
    { message: "Project not found" },
    { status: 404 }
  );
}

    if (user.id !== project?.ownerId) {
  return Response.json(
    { message: "You are not the owner" },
    { status: 401 }
  );
}
    console.table(body);

const result = await tasks.findOneAndUpdate(
  {
    _id: body.taskId,
  },
  {
    $set: {
      assignedTo: body.member,
    },
  },
  {
    returnDocument: "after",
  }
);

  
    const User=await users.findOne({_id:id})

await notifications.insertOne({
  senderId: user.id,
  sender: User?.username ?? "admin",
  receiverId: body.member,
  title: "Assign Task",
  message: `${User?.username ?? "Admin"} assigned you the task "${Task.title}"`,
  type: "task_assigned",
  projectId: Task.projectId,
  createdAt: new Date(),
  seen: false,
  taskId: body.taskId
});

    return Response.json(
      {
        message: "Task assigned successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
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
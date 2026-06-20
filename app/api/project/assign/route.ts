import { verifyToken } from "@/app/lib/verifyToken";
import Notifications from "@/app/Models/Notifications";
import Tasks from "@/app/Models/Tasks";
import User from "@/app/Models/User";
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

  try {
    
    const body = await req.json();
    const Task=await Tasks.findById(body.taskId).populate("projectId" ,"ownerId");
    if (!Task) {
  return Response.json(
    { message: "Task not found" },
    { status: 404 }
  );
}
    if (user.id !== Task.projectId.ownerId.toString()) {
  return Response.json(
    { message: "You are not the owner" },
    { status: 401 }
  );
}
    console.table(body);

    const task = await Tasks.findByIdAndUpdate(
      body.taskId,
      {
        assignedTo: body.user, // frontend sends "user"
      },
      {
         returnDocument: "after"
      }
    );

    if (!task) {
      return Response.json(
        { message: "No task with this id" },
        { status: 404 }
      );
    }
    const username=await User.findById(user.id);

    await Notifications.create({
      senderId: user.id,
    sender: username.username,

    userId: body.user,

    title: "Assign Task",
    message: `${username.username} assigned you the task "${task.title}"`,
    type: "task_assigned",
    projectId:task.projectId,
    })

    return Response.json(
      {
        message: "Task assigned successfully",
        data: task,
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
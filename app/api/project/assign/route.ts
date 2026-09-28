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

const task_to_update = await tasks.findOneAndUpdate(
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

 const task = {
          _id:task_to_update?._id ,
          projectId:task_to_update?.projectId,
          title: task_to_update?.title,
          description: task_to_update?.description,
          dueDate: task_to_update?.dueDate,
          status: task_to_update?.status,
          priority: task_to_update?.priority,
          assignedTo: task_to_update?.assignedTo,
          watchers: task_to_update?.watchers,
          completedAt: task_to_update?.completedAt
      };

             const ragTask = {
              task_id: task._id,
              project_id: task.projectId,
            
              content: `
            Title: ${task.title}
            Description: ${task.description}
            Status: ${task.status}
            Priority: ${task.priority}
            Due Date: ${task.dueDate}
            assignedTo:${task.assignedTo}
              `.trim(),
            
              status: task.status,
              priority: task.priority,
              due_date: task.dueDate,
            };
                    
                const url = process.env.RAG_URL!;
            
            await fetch(`${url}/ingestion`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({tasks:[ragTask]}),
            });


  
    const User=await users.findOne({_id:id})

await notifications.insertOne({
  senderId: user.id,
  sender: User?.username ?? "admin",
  userId: body.member,
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
        data: task_to_update,
      },
      { status: 200 }
    );
  } catch (error) {

  return Response.json(
    {
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : error,
    },
    { status: 500 }
  );
}
}

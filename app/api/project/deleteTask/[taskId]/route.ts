import { verifyToken } from "@/app/lib/verifyToken";
import { notifications } from "@/app/Models/Notifications";
import { projects } from "@/app/Models/Project";
import { tasks } from "@/app/Models/Tasks";
import { users } from "@/app/Models/User";
import { cookies } from "next/headers";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> },
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return Response.json({ message: "Not authorised" }, { status: 401 });
    }

    const currentUser = verifyToken(token);
    const user = await users.findOne({ _id: currentUser.id });
    const { taskId } = await params;
    const task = await tasks.findOne({ _id: taskId });

    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    const project = await projects.findOne({ _id: task.projectId });
    if (!project) {
      return Response.json({ message: "Project not found" }, { status: 404 });
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const isAdmin = Boolean(adminEmail && user?.email === adminEmail);
    const isOwner = project.ownerId === currentUser.id;

    if (!isOwner && !isAdmin) {
      return Response.json(
        { message: "Only the project owner or an admin can delete this task" },
        { status: 403 },
      );
    }

    await Promise.all([
      tasks.deleteOne({ _id: taskId }),
      notifications.deleteMany({ taskId }),
    ]);

    return Response.json({ message: "Task deleted successfully" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

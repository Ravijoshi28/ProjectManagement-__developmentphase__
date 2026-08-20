import { verifyToken } from "@/app/lib/verifyToken";
import { db } from "@/app/lib/astradb";
import { cookies } from "next/headers";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return Response.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const currentUser = await db.collection("users").findOne({ _id: decoded.id });
    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!adminEmail || currentUser?.email !== adminEmail) {
      return Response.json({ message: "Admin access required" }, { status: 403 });
    }

    const { projectId } = await params;
    const project = await db.collection("projects").findOne({ _id: projectId });
    if (!project) return Response.json({ message: "Project not found" }, { status: 404 });

    await Promise.all([
      db.collection("projects").deleteOne({ _id: projectId }),
      db.collection("tasks").deleteMany({ projectId }),
      db.collection("pMembers").deleteMany({ projectId }),
      db.collection("messages").deleteMany({ projectId }),
      db.collection("notifications").deleteMany({ projectId }),
    ]);

    return Response.json({ message: "Project and related data deleted successfully" });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

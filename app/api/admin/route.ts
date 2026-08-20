import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/verifyToken";
import { db } from "@/app/lib/astradb";

// Helper function to normalize status capitalization (e.g., "to_do" or "to do" -> "To Do")
function formatStatusName(status?: string): string {
  if (!status) return "Pending";
  return status
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function GET() {
  try {
    // 1. Authenticate Token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }

    const decodedUser = verifyToken(token);
    if (!decodedUser) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    // 2. Authorize Admin Status
    const usersCollection = db.collection("users");
    const currentUser = await usersCollection.findOne({ _id: decodedUser.id });

    const adminEmail = process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!adminEmail || currentUser?.email !== adminEmail) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // 3. Collection References
    const projectsCollection = db.collection("projects");
    const tasksCollection = db.collection("tasks");
    const messagesCollection = db.collection("messages");

    // 4. Fetch Totals
    const [totalUsers, totalProjects, totalTasks, totalMessagesCount] = await Promise.all([
      usersCollection.countDocuments({}, 10000),
      projectsCollection.countDocuments({}, 10000),
      tasksCollection.countDocuments({}, 10000),
      messagesCollection.countDocuments({}, 10000),
    ]);

    // 5. Count Tasks directly by Status
    const [tasks, projectList] = await Promise.all([
      tasksCollection.find({}).toArray(),
      projectsCollection.find({}).toArray(),
    ]);
    const countsByStatus: Record<string, number> = {};

    tasks.forEach((task) => {
      const status = formatStatusName(task.status);
      countsByStatus[status] = (countsByStatus[status] || 0) + 1;
    });

    // Color definitions
    const statusColors: Record<string, string> = {
      "Completed": "#22c55e",   // Green
      "In Progress": "#3b82f6", // Blue
      "Pending": "#f59e0b",     // Amber
      "To Do": "#ef4444",       // Red
    };

    const formattedTaskData = Object.entries(countsByStatus).map(([name, count]) => ({
      name,
      messages: count, // Using key 'messages' so it connects directly to your existing Recharts PieChart dataKey="messages"
      color: statusColors[name] || "#6b7280",
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalProjects,
        totalTasks,
        totalMessages: totalMessagesCount,
      },
      taskInteractionData: formattedTaskData,
      projects: projectList,
      tasks,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

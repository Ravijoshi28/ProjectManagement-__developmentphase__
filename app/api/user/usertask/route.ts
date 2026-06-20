import ConnectDb from "@/app/lib/mongodb";
import { verifyToken } from "@/app/lib/verifyToken";
import Tasks from "@/app/Models/Tasks";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await ConnectDb();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json(
      { message: "User is not authorized" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);
  console.log("working");
  if (!user) {
    return Response.json(
      { message: "User is not authorized" },
      { status: 401 }
    );
  }

  try {
    const tasks = await Tasks.find({
      assignedTo: user.id,
    });
    console.log("working");
    return Response.json(
      {
        data: tasks,
        count: tasks.length,
      },
      { status: 200 }
    );
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
import { verifyToken } from "@/app/lib/verifyToken";
import { pMembers } from "@/app/Models/PMember";
import { projects } from "@/app/Models/Project";
import { users } from "@/app/Models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // 1. Authenticate Token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "User not authorized" },
        { status: 401 }
      );
    }

    const decode = verifyToken(token);
    const userId = decode?.id;

    if (!decode || !userId) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Fetch all project memberships for this user
    const memberships = await pMembers.find({ userId }).toArray();
    const projectIds = memberships.map((m) => m.projectId);

    if (projectIds.length === 0) {
      return NextResponse.json({ projects: [] }, { status: 200 });
    }

    // 3. Fetch all projects in a SINGLE database query using $in
    const projectList = await projects
      .find({ _id: { $in: projectIds } })
      .toArray();

    // 4. Collect all unique member IDs across all fetched projects
    const allMemberIds = Array.from(
      new Set(
        projectList.flatMap((proj) => proj.memberId || [])
      )
    );

    // 5. Fetch details for ALL members in a SINGLE query
    const memberUsers = await users
      .find(
        { _id: { $in: allMemberIds } },
        { projection: { _id: 1, username: 1, email: 1 } } // Fetch only necessary fields
      )
      .toArray();

    // Map user documents by ID for O(1) lookup
    const userMap = new Map(
      memberUsers.map((user) => [String(user._id), user])
    );

    // 6. Assemble projects with populated member objects
    const formattedProjects = projectList.map((project) => {
      const memberDetails = (project.memberId || [])
        .map((mId: string) => userMap.get(String(mId)))
        .filter(Boolean); // Filter out any missing user records

      return {
        ...project,
        members: memberDetails,
      };
    });

    return NextResponse.json({ projects: formattedProjects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error in fetching projects", error: String(error) },
      { status: 500 }
    );
  }
}

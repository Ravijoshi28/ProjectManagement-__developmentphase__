import { verifyToken } from "@/app/lib/verifyToken";
import { notifications } from "@/app/Models/Notifications";
import { pMembers } from "@/app/Models/PMember";
import { projects } from "@/app/Models/Project";
import { users } from "@/app/Models/User";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // 1. Authenticate Token
  const cookieExtract = await cookies();
  const token = cookieExtract.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "User is not authorized" },
      { status: 401 }
    );
  }

  const user = verifyToken(token);
  if (!user || !user.id) {
    return NextResponse.json(
      { message: "User is not authorized to add members" },
      { status: 401 }
    );
  }

  try {
    // 2. Validate Project Parameter
    const projectId = req.nextUrl.searchParams.get("project");

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await projects.findOne({ _id: projectId });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // 3. Authorization Check (Owner Only)
    if (user.id !== project.ownerId) {
      return NextResponse.json(
        { message: "User is not authorized to add members" },
        { status: 403 }
      );
    }

    // 4. Extract Input Emails & IDs
    const formdata = await req.json();
    const addedEmails: { id: string }[] = formdata.addedEmail || [];

    if (!addedEmails.length) {
      return NextResponse.json(
        { message: "No members provided to add" },
        { status: 400 }
      );
    }

    const userIds = addedEmails.map((f) => f.id);

    // 5. Check Existing Project Members
    const existingMembers = await pMembers
      .find(
        { projectId, userId: { $in: userIds } },
        { projection: { userId: 1 } }
      )
      .toArray();

    const existingUserIds = new Set(existingMembers.map((m) => String(m.userId)));

    // Filter out existing members
    const newMembers = addedEmails.filter((f) => !existingUserIds.has(f.id));

    // If all provided members are already in the project, exit early
    if (newMembers.length === 0) {
      return NextResponse.json(
        { message: "All selected users are already members of this project" },
        { status: 200 }
      );
    }

    const newMemberIds = newMembers.map((f) => f.id);

    // 6. Insert into `pMembers` Collection
    await pMembers.insertMany(
      newMemberIds.map((memberId) => ({
        projectId,
        userId: memberId,
        role: "member",
        createdAt: new Date(),
        joinedAt:new Date()
      }))
    );

    // 7. Update `memberId` array in the `projects` Document
    await projects.updateOne(
      { _id: projectId },
      {
        $addToSet: {
          memberId: { $each: newMemberIds },
        },
      }
    );

    // 8. Send Notifications to NEW Members Only
    const sender = await users.findOne({ _id: user.id });
    const senderName = sender?.username || "A team member";

    await notifications.insertMany(
      newMemberIds.map((memberId) => ({
        senderId: user.id,
        sender: senderName,
        userId: memberId,
        title: "Added to Project",
        message: `${senderName} added you to ${project.name}`,
        type: "project_invite",
        projectId,
        createdAt: new Date(),
        seen:false,
        taskId:"null"
      }))
    );

    return NextResponse.json(
      {
        message: "Users added to project successfully",
        addedCount: newMemberIds.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error while adding members", error: String(error) },
      { status: 500 }
    );
  }
}


     

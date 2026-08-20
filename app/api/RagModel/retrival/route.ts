import { verifyToken } from "@/app/lib/verifyToken";
import { pMembers } from "@/app/Models/PMember";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RetrievalResponse {
  answer?: string;
  matches?: unknown[];
}

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, projectId } = (await req.json()) as {
      text?: string;
      projectId?: string;
    };

    if (!text?.trim() || !projectId) {
      return NextResponse.json(
        { error: "A question and project ID are required." },
        { status: 400 },
      );
    }

    const membership = await pMembers.findOne({ projectId, userId: user.id });
    if (!membership) {
      return NextResponse.json({ error: "Project access denied." }, { status: 403 });
    }

    const ragUrl = process.env.RAG_URL;
    if (!ragUrl) {
      return NextResponse.json(
        { error: "RAG service is not configured." },
        { status: 503 },
      );
    }

    const response = await fetch(`${ragUrl}/retrieval/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: text.trim(),
        project_id: projectId,
        limit: 5,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "The RAG service could not complete the request." },
        { status: 502 },
      );
    }

    const result = (await response.json()) as RetrievalResponse;
    return NextResponse.json({
      success: true,
      data: result.answer || "No relevant project information was found.",
      matches: result.matches || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

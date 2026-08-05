import gemini from "@/app/lib/gemini";
import { verifyToken } from "@/app/lib/verifyToken";
import { geminiModel } from "@/app/Models/Gemini";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication token is missing." },
        { status: 401 }
      );
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const { text,file } = await req.json();

    console.log(text,file.url,file.mimeType);
     
    if (!file.text && !file.url) {
      return NextResponse.json(
        { error: "Either 'file.text' or 'url' is required." },
        { status: 400 }
      );
    }

    

    const res = await gemini(text, file.url,file.mimeType);
    console.log(res);
    if (!res) {
  return NextResponse.json(
    { message: "Failed to generate response." },
    { status: 500 }
  );
}

    await geminiModel.insertOne({
        _id:crypto.randomUUID(),
        type:file.url?"file":"text",
         file: file.url
    ? {
        url:file.url,
        mimeType:file.mimeType,
      }
    : null,
      text:text,
        userId:user.id,
        response:res
    ,createdAt:new Date()},)

    return NextResponse.json(
      {
        success: true,
        data: res,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/... error:", error);

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
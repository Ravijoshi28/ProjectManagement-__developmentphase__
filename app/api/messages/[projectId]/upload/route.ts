import { getAuthenticatedUserId } from "@/app/lib/server/authenticatedUser";
import {
  createStoragePath,
  uploadToSupabase,
  validateUpload,
} from "@/app/lib/server/supabaseStorage";
import { pMembers } from "@/app/Models/PMember";

const MESSAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return Response.json({ message: "Unauthorised user" }, { status: 401 });

  const { projectId } = await params;
  const membership = await pMembers.findOne({ projectId, userId });
  if (!membership) {
    return Response.json({ message: "You are not a member of this project." }, { status: 403 });
  }

  const formData = await request.formData();
  const value = formData.get("file");
  const file = value instanceof File ? value : null;
  const validationError = validateUpload(file, {
    maxBytes: 10 * 1024 * 1024,
    allowedTypes: MESSAGE_TYPES,
  });
  if (validationError) return Response.json({ message: validationError }, { status: 400 });

  try {
    const url = await uploadToSupabase({
      bucket: "messages",
      path: createStoragePath(projectId, userId, file!.name),
      file: file!,
    });
    return Response.json({ url, mimeType: file!.type });
  } catch (error) {
    return Response.json({ message: "Failed to upload attachment." }, { status: 500 });
  }
}

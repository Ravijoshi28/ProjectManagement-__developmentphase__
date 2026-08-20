import { getAuthenticatedUserId } from "@/app/lib/server/authenticatedUser";
import {
  createStoragePath,
  uploadToSupabase,
  validateUpload,
} from "@/app/lib/server/supabaseStorage";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return Response.json({ message: "Unauthorised user" }, { status: 401 });

  const formData = await request.formData();
  const value = formData.get("file");
  const file = value instanceof File ? value : null;
  const validationError = validateUpload(file, {
    maxBytes: 5 * 1024 * 1024,
    allowedTypes: IMAGE_TYPES,
  });
  if (validationError) return Response.json({ message: validationError }, { status: 400 });

  try {
    const url = await uploadToSupabase({
      bucket: "Gemini",
      path: createStoragePath(userId, file!.name),
      file: file!,
    });
    return Response.json({ url, mimeType: file!.type });
  } catch (error) {
    return Response.json({ message: "Failed to upload image." }, { status: 500 });
  }
}

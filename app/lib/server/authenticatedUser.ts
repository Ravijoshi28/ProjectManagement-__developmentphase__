import "server-only";

import { verifyToken } from "@/app/lib/verifyToken";
import { cookies } from "next/headers";

export async function getAuthenticatedUserId() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    return verifyToken(token).id || null;
  } catch {
    return null;
  }
}

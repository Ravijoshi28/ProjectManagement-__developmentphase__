import { axiosInstance } from "@/app/lib/axios";
import axios from "axios";

export type UploadedFile = { url: string; mimeType: string };

async function uploadFile(endpoint: string, file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<UploadedFile>(endpoint, formData);
  return response.data;
}

export const uploadProfileImage = (file: File) => uploadFile("/profile/upload", file);
export const uploadGeminiImage = (file: File) => uploadFile("/gemini/upload", file);
export const uploadMessageFile = (projectId: string, file: File) =>
  uploadFile(`/messages/${encodeURIComponent(projectId)}/upload`, file);

export function getUploadErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

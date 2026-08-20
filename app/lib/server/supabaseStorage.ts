import "server-only";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SECRET;

if (!supabaseUrl || !supabaseSecret) {
  throw new Error("Supabase server credentials are not configured.");
}

const storageClient = createClient(supabaseUrl, supabaseSecret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type UploadOptions = {
  bucket: string;
  path: string;
  file: File;
};

export async function uploadToSupabase({ bucket, path, file }: UploadOptions) {
  const bytes = await file.arrayBuffer();
  const { error } = await storageClient.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  return storageClient.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export function createStoragePath(...parts: string[]) {
  const originalName = parts.pop() ?? "file";
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
  return [...parts, `${crypto.randomUUID()}-${safeName}`].join("/");
}

export function isPublicStorageUrl(url: string, bucket: string) {
  try {
    const expected = new URL(
      `/storage/v1/object/public/${encodeURIComponent(bucket)}/`,
      supabaseUrl
    );
    const actual = new URL(url);
    return actual.origin === expected.origin && actual.pathname.startsWith(expected.pathname);
  } catch {
    return false;
  }
}

export function validateUpload(
  file: File | null,
  options: { maxBytes: number; allowedTypes: Set<string> }
) {
  if (!file || file.size === 0) return "A file is required.";
  if (file.size > options.maxBytes) {
    return `File must be ${Math.floor(options.maxBytes / 1024 / 1024)} MB or smaller.`;
  }
  if (!options.allowedTypes.has(file.type)) return "This file type is not allowed.";
  return null;
}

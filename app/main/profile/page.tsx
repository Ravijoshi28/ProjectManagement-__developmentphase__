"use client";
import {
  getUploadErrorMessage,
  uploadProfileImage,
} from "@/app/frontendLib/upload/upload";
import { useState } from "react";
import Image from "next/image";
import { useUserState } from "@/app/zustand/userState";
import { Camera, Loader2, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { changeProfile } from "@/app/frontendLib/profile/profile";
import { toast } from "sonner";
import { PageHeader } from "@/components/workspace/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, setData, logout } = useUserState();
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const displayName = name ?? user?.username ?? "";
  const displayImage = image === undefined ? user?.image : image;
  const mutation = useMutation({ mutationFn: changeProfile });
  const busy = uploading || mutation.isPending;

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!user || busy || !displayName.trim()) return;
    try {
      await mutation.mutateAsync({
        name: displayName.trim(),
        image: displayImage ?? null,
      });
      setData({
        username: displayName.trim(),
        image: displayImage ?? null,
        email: user.email,
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not save your profile. Please try again.");
    }
  }
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadProfileImage(file);
      setImage(uploaded.url);
    } catch (error) {
      toast.error(getUploadErrorMessage(error, "Could not upload your photo"));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/auth");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }
  return (
    <div className="page-shell">
      <PageHeader
        title="Account settings"
        description="Make yourself at home. Manage how you appear to your team."
      />
      <div className="max-w-4xl space-y-6">
        <form
          onSubmit={handleSave}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-5 border-b border-border p-6 sm:p-8">
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Your profile photo"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <UserRound size={32} strokeWidth={1.5} />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Profile photo</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Help your teammates recognize you.
              </p>
              <label className="relative mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted focus-within:ring-2 focus-within:ring-primary">
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
                {uploading ? "Uploading..." : "Change photo"}
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Change profile photo"
                  disabled={busy}
                  onChange={handleUpload}
                  className="absolute inset-0 w-full cursor-pointer opacity-0"
                />
              </label>
            </div>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_1.6fr] sm:p-8">
            <div>
              <h2 className="text-base font-semibold">Personal information</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your name is visible in projects and team conversations.
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  autoComplete="name"
                  value={displayName}
                  onChange={(event) => setName(event.target.value)}
                  required
                  disabled={busy}
                  className="h-11"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email address</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="h-11 bg-muted/40 text-muted-foreground"
                  aria-describedby="email-help"
                />
                <p id="email-help" className="text-xs text-muted-foreground">
                  The email you use to sign in. It cannot be changed here.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end border-t border-border bg-muted/20 px-6 py-4">
            <Button
              type="submit"
              disabled={busy || !user || !displayName.trim()}
              className="rounded-xl"
            >
              {mutation.isPending && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {mutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Sign out</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              End your session on this device.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
            className="self-start rounded-xl text-destructive"
          >
            <LogOut size={16} />
            {loggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </section>
      </div>
    </div>
  );
}

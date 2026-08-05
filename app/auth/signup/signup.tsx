"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserState } from "@/app/zustand/userState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

interface UserData {
  username: string;
  email: string;
  password: string;
}

export default function Signup() {
  const { signup } = useUserState();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setData] = useState<UserData>({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup(formData);
      setData({ username: "", email: "", password: "" });
      toast.success("Account created successfully! Please log in.");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50/60 p-4 sm:p-6 md:p-8 dark:bg-slate-950">
      <Card className="w-full max-w-md border border-slate-200/80 bg-white p-2 sm:p-4 shadow-xl shadow-slate-200/50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:shadow-none rounded-3xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Create an Account
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join today to start managing your personal workspace.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Full Name
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                placeholder="John Doe"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/20 dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-slate-600"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                placeholder="name@example.com"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-3.5 text-sm transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/20 dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-slate-600"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  minLength={8}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-3.5 pr-10 text-sm transition-all focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-400/20 dark:border-slate-800 dark:bg-slate-800/40 dark:focus:border-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating
                  Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {/* Login Link Footer */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="login"
              className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-slate-200"
            >
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
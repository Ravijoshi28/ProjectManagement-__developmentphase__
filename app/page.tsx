import { redirect } from "next/navigation";

export default function Home() {
  const user = false; // your auth check

  if (user) {
    redirect("/main/dashboard");
  }

  redirect("/auth");
}
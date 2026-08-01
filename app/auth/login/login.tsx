"use client"

import { useUserState } from "@/app/zustand/userState"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner"

export default function Login() {
  const router = useRouter();
  const {login}=useUserState()
  const [formData, setData] = useState({
    email: "",
    password: "",
  })

  const submit =async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

    try{
       await login(formData);

    setData({email:"",password:""});
    toast.success("Successfully Entered")
    router.refresh();
      router.push("/main/dashboard");
    }
    catch(error){
        console.log(error);
        toast.error("Password or email wrong ")
    }
  
  }

  return (
    <>
      <Card className="h-100 w-full gap-5">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-mono">
            Login Page
          </CardTitle>

          <CardDescription className="text-xl">
            Login with your email
          </CardDescription>

          <CardAction></CardAction>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>

                <Input
                  id="password"
                  type="password"
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
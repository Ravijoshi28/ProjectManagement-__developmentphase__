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
import { useState } from "react"
import { toast } from "sonner"

interface UserData {
  username: string;
  email: string;
  password:string;
}


export default function Signup(){
    const {signup}=useUserState();
    const [formData,setData]=useState<UserData>({
      username:"",
      email:"",
      password:""
    })
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      try {
        await signup(formData);
      setData({
        username:"",email:"",password:""
      })
      toast.success("user created ...login to enter")
      } catch (error) {
        toast.error("server error")
      }
      
    }
    return <>
     <Card className="h-100 w-full gap-5 ">
        <CardHeader>
            <CardTitle className="text-center text-2xl font-mono ">SignUp Page</CardTitle>
            <CardDescription >Become the new member and start your journey</CardDescription>
            <CardAction>

            </CardAction>
        </CardHeader>
          <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                placeholder="m@example.com"
                onChange={(e)=>setData((prev)=>({...prev,email:e.target.value}))}
                required
              />
            </div>
            
                
            <div className="grid gap-2">
              <Label htmlFor="Name">Name</Label>
              <Input
                id="Name"
                type="text"
                value={formData.username}
                placeholder="FullName"
                onChange={(e)=>setData((prev)=>({...prev,username:e.target.value}))}
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
              <Input id="password" type="password"
              placeholder="length should be more than 8"
              value={formData.password}
              minLength={8}
              onChange={(e)=>setData((prev)=>({...prev,password:e.target.value}))} required />
            </div>
          </div>
          <Button type="submit" className="w-full">
          Signup
        </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>

    </Card></>

}
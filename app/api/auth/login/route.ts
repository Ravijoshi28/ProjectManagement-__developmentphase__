// import User from "@/app/Models/User";
import { cookies } from "next/headers";
// import ConnectDb from "@/app/lib/mongodb";
import { Generate } from "@/app/lib/tokenGenerate";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { users } from "@/app/Models/User";
import { LoginSchema } from "@/app/schema/zod";
const PEPPER=process.env.PASSWORD_PEPPER

export async function POST(req:Request){

    //  await ConnectDb();

        const body=LoginSchema.parse(await req.json());
      

    try{
        const user=await users.findOne({email:body.email})
        
        if(!user) return Response.json({message:"user does not exist"},{status:401});
         
        if(!user.password){
           return Response.json(
    { message: "Invalid account" },
    { status: 401 }
  );
        }
        const newpass=body.password+PEPPER;
       
        const pass=await bcrypt.compare(newpass,user.password)
         
        if(!pass) {
            return Response.json({message:"user or password does not match"},{status:401});
        }

         
      const token= await Generate(user._id);
     

      if (!token) {
      return NextResponse.json({ success: false, error: "Token generation failed" }, { status: 500 });
    }
      console.log("loggedin")
       const response = NextResponse.json(
      {
        success: true,
        user: {
          id:user._id,
          username:user.username,
          email:user.email,
          image:user.image
        },
        
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Automatically true in production
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 1 week
});

    return response;


    }
    catch(error:any){
           
            return Response.json({message:`${error }has occured during login`},{status:400});
            
    }
}
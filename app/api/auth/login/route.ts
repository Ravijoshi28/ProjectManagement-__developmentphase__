import User from "@/app/Models/User";
import { cookies } from "next/headers";
import ConnectDb from "@/app/lib/mongodb";
import { Generate } from "@/app/lib/tokenGenerate";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
const PEPPER=process.env.PASSWORD_PEPPER

export async function POST(req:Request){

     await ConnectDb();

        const body=await req.json();
      

    try{
        const Users=await User.findOne({email:body.email})
        
        if(!Users) return Response.json({message:"User does not exist"},{status:401});
         
        const newpass=body.password+PEPPER;
       
        const pass=await bcrypt.compare(newpass,Users.password)
         
        if(!pass) {
            return Response.json({message:"User or password does not match"},{status:401});
        }

         
      const token= await Generate(Users._id);
     

      if (!token) {
      return NextResponse.json({ success: false, error: "Token generation failed" }, { status: 500 });
    }

       const response = NextResponse.json(
      {
        success: true,
        user: {
          id:Users._id,
          username:Users.username,
          email:Users.email
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
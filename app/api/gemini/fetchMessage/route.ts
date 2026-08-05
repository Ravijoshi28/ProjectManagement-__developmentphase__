import { verifyToken } from "@/app/lib/verifyToken";
import { geminiModel } from "@/app/Models/Gemini";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){

    const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
    
        if (!token) {
          return NextResponse.json(
            { error: "Authentication token is missing." },
            { status: 401 }
          );
        }
    
        const user = verifyToken(token);
    
        if (!user) {
          return NextResponse.json(
            { error: "Invalid or expired token." },
            { status: 401 }
          );}

          try {
            
                const message=await geminiModel.find({
                    userId:user.id
                },{
                    sort:{
                        createdAt:1
                    }
                }).toArray();

              if (message.length === 0) {
                return NextResponse.json(
                    { message: [] },
                    { status: 200 }
                );
                }

                return NextResponse.json(
                    { message },
                    { status: 200 }
                    );

          } catch (error) {
            console.error(error);

            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
            }

} 
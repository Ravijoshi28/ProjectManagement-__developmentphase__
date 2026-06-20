import User from "@/app/Models/User";
import ConnectDb from "@/app/lib/mongodb";
import { Generate } from "@/app/lib/tokenGenerate";
import bcrypt from "bcryptjs";


const PEPPER=process.env.PASSWORD_PEPPER

export async function POST(req: Request) {
  await ConnectDb();

  try {
    const body = await req.json();

    // check existing email
    const existingEmail = await User.findOne({
      email: body.email,
    });

    if (existingEmail) {
      return Response.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // check existing username
    const existingUsername = await User.findOne({
      username: body.username,
    });

    if (existingUsername) {
      return Response.json(
        { message: "Username already taken" },
        { status: 409 }
      );
    }

    // password validation
    if (body.password.length <7) {
      return Response.json(
        {
          message:
            "Password length should be greater than 8",
        },
        { status: 400 }
      );
    }

    // hashing
    const newpass = body.password + PEPPER;

    const hashedPassword = await bcrypt.hash(
      newpass,
      10
    );

    // create user
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      username: body.username,
    });

    await newUser.save();

    
    

    return Response.json(
      { message: "User successfully registered" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error" },
      { status: 500 }
    );
  }
}

// import User from "@/app/Models/User";
// import ConnectDb from "@/app/lib/mongodb";
// import { Generate } from "@/app/lib/tokenGenerate";
import { users } from "@/app/Models/User";
import { UserSchema } from "@/app/schema/zod";
import bcrypt from "bcryptjs";


const PEPPER=process.env.PASSWORD_PEPPER

export async function POST(req: Request) {
  // await ConnectDb();

  try {
    const body = UserSchema.parse(await req.json());

    // check existing email
    const existingEmail = await users.findOne({
      email: body.email,
    });

    if (existingEmail) {
      return Response.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // check existing username
    const existingUsername = await users.findOne({
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
  await users.insertOne({
  _id: crypto.randomUUID(), // optional if Astra generates one for you
  name: body.username,
  email: body.email,
  password: hashedPassword,
  username: body.username,
  image: null,
  createdAt: new Date(),
});

    
    

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

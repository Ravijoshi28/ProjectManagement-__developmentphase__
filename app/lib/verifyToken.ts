import jwt from "jsonwebtoken";

export const verifyToken=(token:string)=>{

    try {
  const decoded = jwt.verify(
      token,
      process.env.MY_SECRET_JWTTOKEN as string
    );
   
    return decoded;

  } catch (error) {
    return Response.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }

}
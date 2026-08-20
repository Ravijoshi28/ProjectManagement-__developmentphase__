import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


export const Generate = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("UserId not available");
    }

    const token = jwt.sign(
      {
        id: userId,
      },
      process.env.MY_SECRET_JWTTOKEN as string,
      {
        expiresIn: "7d",
      }
    );

   return token;

    
  } catch (error) {

    return null;
  }
};

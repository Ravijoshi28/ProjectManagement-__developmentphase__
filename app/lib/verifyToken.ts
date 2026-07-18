import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
}

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(
      token,
      process.env.MY_SECRET_JWTTOKEN as string
    ) as TokenPayload;
  } catch {
    throw new Error("Invalid token");
  }
};
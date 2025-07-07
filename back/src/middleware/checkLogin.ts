import { NextFunction, Request, Response } from "express"; 
import { jwtVerify } from "jose";
import { ClientError } from "../utils/errors";
import { JWT_SECRET } from "../config/envs";
import "express";

declare module "express" {
  interface Request {
    user?: { id: number };
  }
}

export const checkLogin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) return next(new ClientError("Token is required", 401));

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const { userId } = payload as { userId: number };

    req.user = { id: userId };
    next();
  } catch (error) {
    console.error("Error verificando token:", error); // Depurar
    return next(new ClientError("Invalid token", 401));
  }
};

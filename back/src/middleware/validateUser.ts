// middlewares/validateUser.ts
import { Request, Response, NextFunction } from "express";
import { checkUserExists } from "../services/user.service";
import { ClientError } from "../utils/errors";

// Para login: verificar que el usuario exista
export const requireUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!(await checkUserExists(email))) {
    return next(new ClientError("El usuario no existe", 400));
  }
  next();
};

// Para register: verificar que NO exista
export const rejectIfUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (await checkUserExists(email)) {
    return next(new ClientError("El usuario ya existe", 400));
  }
  next();
};

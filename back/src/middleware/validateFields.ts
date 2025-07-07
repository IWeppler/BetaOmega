import { Request, Response, NextFunction } from "express";
import { ClientError } from "../utils/errors";

export const validateFields =
  (fields: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter((field) => !req.body[field]);
    if (missing.length > 0) {
      return next(new ClientError(`Faltan Campos: ${missing.join(", ")}`, 400));
    }
    next();
  };
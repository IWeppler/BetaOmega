import { Request, Response } from "express";
import {
  loginUserService,
  registerUserService,
  getMeService,
  logoutUserService,
} from "../services/user.service";
import { ClientError } from "../utils/errors";

// Obtener los detalles del usuario autenticado
export const getMe = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ClientError("Unauthorized: user not found in request", 401);
  }

  const user = await getMeService(req.user);
  res.status(200).send(user);
};

// Registro de usuario
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  const newUser = await registerUserService({
    name,
    email,
    password,
    phone,
  });
  res.status(201).send(newUser);
};

// Inicio de sesión de usuario
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await loginUserService({ email, password });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax", //lax
    secure: false, //true en produccion
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  });

  res.status(200).json({
    success: true,
    user,
  });
};

// Cerrar sesión del usuario
export const logoutUser = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ message: "Unauthorized: user not found in request" });
    return;
  }
  await logoutUserService(req.user);

  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: false, //false en desarrollo
  });

  res.status(200).json({ message: "User logged out successfully" });
};

import { LoginUserDto, RegisterUserDto } from "../dtos/userDto";
import { User } from "../entities/User";
import { UserRepository } from "../repo/user.repository";
import { checkPasswordService, CredentialService } from "./credential.service";
import { JWT_SECRET } from "../config/envs";
import { SignJWT } from "jose";
// import { Buffer } from "buffer";

// Verifica si un usuario ya existe por email
export const checkUserExists = async (email: string): Promise<boolean> => {
  const user = await UserRepository.findOneBy({ email });
  return !!user;
};

// Registro de nuevo usuario
export const registerUserService = async (
  registerUserDto: RegisterUserDto
): Promise<User> => {
  const user = await UserRepository.create(registerUserDto);
  await UserRepository.save(user);
  const credential = await CredentialService({
    password: registerUserDto.password,
  });

  user.credential = credential;
  await UserRepository.save(user);
  return user;
};

// Login de usuario
export const loginUserService = async (
  loginUserDto: LoginUserDto
): Promise<{ token: string; user: User }> => {
  const user: User | null = await UserRepository.findOne({
    where: { email: loginUserDto.email },
    relations: ["credential"],
  });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await checkPasswordService(
    loginUserDto.password,
    user.credential.password
  );
  if (!isPasswordValid) throw new Error("Invalid credentials");

  // Crear token con jose
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  return {
    user,
    token,
  };
};

// Obtener detalles del usuario autenticado
export const getMeService = async (user: { id: number }): Promise<User> => {
  const userDetails = await UserRepository.findOne({
    where: { id: user.id },
    relations: ["credential"],
  });
  if (!userDetails) throw new Error("User not found");
  return userDetails;
};

export const logoutUserService = async (user: {
  id: number;
}): Promise<void> => {
  console.log(`User ${user.id} logged out`);
};

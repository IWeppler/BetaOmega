enum eRole {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: eRole;
}

export interface IGetUser {
  name: string;
  email: string;
  phone: string;
}

export interface IRegister {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}
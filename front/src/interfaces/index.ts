enum eRole {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser {
  userId: string;
  email?: string;
  name?: string;
  roles?: eRole[];
}

export interface IGetUser {
  name: string;
  email: string;
}

export interface IRegister {
  email: string;
  password: string;
  phone: string;
  country: string;
  first_name: string;
  last_name: string;
}


export interface ILogin {
  email: string;
  password: string;
}
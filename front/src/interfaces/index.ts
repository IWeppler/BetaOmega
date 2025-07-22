// --- Entidades de la Aplicación (Datos que recibes de la API) ---

export enum UserRole {
  ADMIN = "admin",
  STUDENT = "estudiante",
}

export interface IUser {
  id: string;
  profile_image_url: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number: string;
  country: string;
}

export interface IBook {
  id: string;
  order: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  total_chapters: number;
  contents: IBookContent[]; 
}

export interface IGetUser {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number: string;
  country: string;
}



// La entidad BookContent tal como la recibes del backend

export interface IBookContent {
  id: string; 
  book_id: string;
  chapter_number: number;
  title: string;
  md_content: string;
}

export interface IUserProgress {
  id: string;
  user_id: string;
  book_id: string;
  chapter_number: number;
  progress: number;
  updated_at: string;
}



// --- DTOs (Data Transfer Objects - Datos que envías a la API) ---

export interface IUpsertProgressDto {
  user_id: string;
  book_id: string;
  current_chapter: number;
}

export interface IUpdateUser { 
  profile_image_url?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
}

export interface ICreateBook {
  title: string;
  slug: string;
  description: string;
  total_chapters: number;
  cover_url: string;
}

export interface IUpdateBook {
  title?: string;
  slug?: string;
  description?: string;
  total_chapters?: number;
  cover_url?: string;
}

export interface IBookContent {
  book_id: string;
  chapter_number: number;
  title: string;
  md_content: string;
}

export interface ICreateBookContent {
  book_id: string;
  chapter_number: number;
  title: string;
  md_content: string;
}

export interface IUpdateBookContent {
  title?: string;
  md_content?: string;
}


export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface IRegister {
  email: string;
  password: string;
  phone_number: string;
  country: string;
  first_name: string;
  last_name: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IBook {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  total_chapters: number;
  contents: IBookContent[];
}
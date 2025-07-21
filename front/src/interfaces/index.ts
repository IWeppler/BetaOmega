export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
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

export interface IGetUser {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number: string;
  country: string;
}

export interface IUpdateUser { 
  profile_image_url?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country?: string;
}

export interface IChangePassword {
  old_password: string;
  new_password: string;
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

export interface IBook {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  total_chapters: number;
  contents: IBookContent[];
}

export interface IBookContent {
  id: string;
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

export interface IUpsertProgressDto {
  user_id: string;
  book_id: string;
  current_chapter: number;
}
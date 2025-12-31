// --- Entidades de la Aplicación (Datos que recibes de la API) ---

export enum UserRole {
  ADMIN = "admin",
  STUDENT = "user",
}

export interface IUser {
  id: string;
  email: string;
  full_name: string;
  branch: string;
  avatar_url?: string;
  role: UserRole;
  phone_number?: string;
  country: string;
  created_at: string;
}

export interface IEvent {
  id: number;
  title: string;
  description: string;
  event_date: string; // ISO String timestamp
  image_url?: string;
  created_at?: string;
}

export interface IBook {
  id: string;
  title: string;
  order: number;
  slug: string;
  description: string;
  cover_url: string;

  pdf_url?: string; // URL del archivo en Storage
  is_locked?: boolean;

  total_chapters: number;
  book_content?: IBookContent[];
  chapters?: IBookContent[];
}

export interface IBookContent {
  id: number;
  book_id: string;
  chapter_number: number;
  title: string;
  md_content: string;
}

export interface IUserProgress {
  id: number;
  user_id: string;
  book_id: string;
  current_page: number;
  is_completed: boolean;
  updated_at: string;
  chapter_number: number;
  current_chapter: number;
  progress: number;
}

// --- DTOs ---
export interface IUpsertProgressDto {
  user_id: string;
  book_id: string;
  current_chapter: number;
  chapter_number: number;
  current_page: number;
  is_completed: boolean;
}

export interface ICreateBook {
  title: string;
  slug: string;
  description: string;
  total_chapters: number;
  cover_url: string;
  order?: number;
}

export interface IUpdateBook {
  title?: string;
  slug?: string;
  description?: string;
  total_chapters?: number;
  cover_url?: string;
}

export interface ICreateBookContent {
  book_id: string;
  chapter_number: number;
  title: string;
  md_content: string;
}

export interface IUpdateBookContent {
  title: string;
  md_content: string;
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
  full_name: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export type IUpdateUser = Partial<IUser>;

export interface ICategory {
  id: number;
  name: string;
  color_class: string;
  created_at?: string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  is_pinned: boolean;
  created_at: string;
  created_by?: string;
  category_id: number;
  category?: ICategory;
}

export interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive?: boolean;
  className?: string;
}
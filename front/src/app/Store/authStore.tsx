
import { create } from "zustand";
import { login, getMe, logout } from "@/services/auth.service";
import { ILogin, IUser } from "@/interfaces";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  login: (values: ILogin) => Promise<void>;
  logOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUserState: (newUserData: Partial<IUser>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      const user = await getMe();
      set({ user, loading: false });
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      set({ user: null, loading: false });
    }
  },

  // Login
  login: async (values) => {
    try {
      const response = await login(values);
      if (response.success) {
        const user = await getMe();
        set({ user });
      } else {
        throw new Error("Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error desconocido al iniciar sesión:", error);
      throw error;
    }
  },

  // Logout
  logOut: async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      set({ user: null });
    }
  },

  updateUserState: (newUserData: Partial<IUser>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...newUserData } : null,
    }));
  },

}));

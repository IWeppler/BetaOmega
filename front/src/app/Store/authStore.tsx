// src/stores/authStore.ts
import { create } from "zustand";
import { getUser } from "@/services/getUser";
import { loginAction } from "@/services/form";
import { logout as logoutAction } from "@/services/logout";
import { ILogin, IUser } from "@/interfaces";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  login: (values: ILogin) => Promise<void>;
  logOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  // Fetch user al inicio
  fetchUser: async () => {
    try {
      const user = await getUser();
      set({ user, loading: false });
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      set({ user: null, loading: false });
    }
  },

  // Login
  login: async (values) => {
    try {
      const response = await loginAction(values);
      if (response.success) {
        const user = await getUser();
        set({ user });
      } else {
        throw new Error(response.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error desconocido al iniciar sesión:", error);
      throw error;
    }
  },

  // Logout
  logOut: async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      set({ user: null });
    }
  },
}));

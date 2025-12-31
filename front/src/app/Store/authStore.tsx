import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
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
      set({ loading: true });

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        set({ user: null, loading: false });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error cargando perfil:", profileError);
      }

      if (!profile) {
        console.warn(
          "El usuario está autenticado pero no tiene perfil en la DB."
        );
        // Aquí podrías manejarlo, pero al menos ya no rompe la app con error 406.
      }

      // 3. Unificar datos de Auth + Base de Datos
      const fullUser = {
        ...authUser,
        ...profile, // Esto inyecta: branch, full_name, avatar_url, etc.
      } as IUser;

      set({ user: fullUser, loading: false });
    } catch (error) {
      console.error("Error general en fetchUser:", error);
      set({ user: null, loading: false });
    }
  },

  // Iniciar Sesión
  login: async ({ email, password }: ILogin) => {
    // Desestructuramos values
    try {
      // 1. Login con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const fullUser = {
          id: data.user.id,
          email: data.user.email,
          ...profile,
        } as IUser;

        set({ user: fullUser });
      }
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },

  // Cerrar Sesión
  logOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  },

  updateUserState: (newUserData: Partial<IUser>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...newUserData } : null,
    }));
  },
}));

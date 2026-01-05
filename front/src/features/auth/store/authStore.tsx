import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import { ILogin, IUser } from "@/interfaces";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  login: (values: ILogin) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUserState: (newUserData: Partial<IUser>) => void;
  setUser: (user: IUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

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

      const fullUser = { ...authUser, ...profile } as IUser;

      set({ user: fullUser, loading: false });
    } catch (error) {
      console.error("Error al cargar el usuario:", error);
      set({ user: null, loading: false });
    }
  },

  login: async ({ email, password }: ILogin) => {
    try {
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

  loginWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error al iniciar con Google:", error);
      throw error;
    }
  },

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

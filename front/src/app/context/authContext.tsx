"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { ILogin, IUser } from "../../interfaces";
import { routes } from "@/app/routes";
import { logout as logoutAction } from "@/services/logout";
import { getUser } from "@/services/getUser";
import { loginAction } from "@/services/form";

interface AuthContextType {
  user: IUser | null;
  login: (values: ILogin) => Promise<void>;
  loading: boolean;
  logOut: () => void;
}

// CONTEXT
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe ser inicializado con el AuthProvider");
  }
  return context;
};

// PROVIDER
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // LOGOUT
  const logOut = useCallback(async () => {
    try {
      await logoutAction();
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setUser(null);
      router.push(routes.login);
    }
  }, [router]);

  // SET USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (err) {
        console.error("Error al obtener usuario", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // LOGIN
  const login = useCallback(
    async (values: ILogin) => {
      try {
        const response = await loginAction(values); // ejecuta el server action
        if (response.success) {
          const data = await getUser(); // recupera el usuario actualizado
          setUser(data || response.user);
          router.push(routes.dashboard); // o a donde desees redirigir
        } else {
          throw new Error(response.error || "Error al iniciar sesión");
        }
      } catch (err) {
        console.error("Error desconocido al iniciar sesión:", err);
        throw err; // para que el form lo pueda capturar
      }
    },
    [router]
  );

  const value = { user, login, loading, logOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

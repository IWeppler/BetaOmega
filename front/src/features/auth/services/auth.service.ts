import { supabase } from "@/lib/supabaseClient";
import { ILogin, IRegister } from "@/interfaces";
import { getErrorMessage } from "@/shared/helper/getErrorMessage";

// Login con Supabase
export const login = async (values: ILogin) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

// Registro con Supabase (incluyendo metadata)
export const register = async (values: IRegister) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.full_name,
          phone_number: values.phone_number,
        },
      },
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

// Logout
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Obtener sesión actual (reemplaza a getMe)
export const getSession = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch {
    return null;
  }
};

// Obtener usuario actual
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch {
    return null;
  }
};

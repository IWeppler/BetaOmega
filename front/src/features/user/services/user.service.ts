import { supabase } from "@/lib/supabaseClient";
import { IUser, IUpdateUser, IChangePassword } from "@/interfaces";
import { getErrorMessage } from "@/shared/helper/getErrorMessage";

export const updateUserProfile = async (values: IUpdateUser) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
      .from("profiles")
      .update(values)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, user: data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
};

// Cambiar contraseña (Auth)
export const changePassword = async (values: IChangePassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });

    if (error) throw error;
    return { success: true, message: "Contraseña actualizada correctamente" };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
};

// Subir avatar (Storage + Profile Update)
export const uploadImageProfile = async (file: File) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const fileExt = file.name.split(".").pop();
    // o timestamp para evitar caché
    const filePath = `${user.id}/avatar_${Date.now()}.${fileExt}`;

    // 1. Subir
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2. Obtener URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // 3. Actualizar perfil
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return { success: true, user: profile };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
};

// Obtener todos los usuarios (Gestión Admin - desde public.profiles)
export const fetchAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, users: data as IUser[] };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
};

// Actualizar Rol (Solo Admins deberían poder hacer esto mediante RLS)
export const updateUserRole = async (id: string, role: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, user: data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
};

// Eliminar Usuario (Borrado lógico o de perfil)
export const deleteUser = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, user: data };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
};

import { supabase } from "@/lib/supabaseClient";
import {
  IBookContent,
  ICreateBookContent,
  IUpdateBookContent,
} from "@/interfaces";
import { getErrorMessage } from "@/shared/helper/getErrorMessage";

// Obtiene un capitulo específico por slug del libro y número de capítulo
export const getChapter = async (slug: string, chapterNumber: number) => {
  try {
    const { data, error } = await supabase
      .from("book_content")
      .select("*, books!inner(slug, title)")
      .eq("books.slug", slug)
      .eq("chapter_number", chapterNumber)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(
      `Error al obtener el capítulo ${chapterNumber} del libro "${slug}":`,
      error
    );
    return null;
  }
};

// Crea un capítulo (contenido) nuevo.
export const createBookContent = async (
  contentData: ICreateBookContent
): Promise<{
  success: boolean;
  content?: IBookContent;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("book_content")
      .insert(contentData)
      .select()
      .single();

    if (error) throw error;

    return { success: true, content: data as IBookContent };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

// Sube una imagen al contenido (Bucket 'content-images')
export const uploadContentImage = async (
  imageFile: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    if (!imageFile) throw new Error("No hay archivo");

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `content_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("content-images")
      .upload(filePath, imageFile, { upsert: false });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("content-images")
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

// Actualiza un capítulo existente.
export const updateContent = async (
  contentId: number,
  contentData: IUpdateBookContent
): Promise<IBookContent | null> => {
  try {
    const { data, error } = await supabase
      .from("book_content")
      .update(contentData)
      .eq("id", contentId)
      .select()
      .single();

    if (error) throw error;
    return data as IBookContent;
  } catch (error) {
    console.error(`Error al actualizar contenido ${contentId}:`, error);
    return null;
  }
};

// Elimina un capítulo por su ID.
export const deleteContent = async (contentId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("contents")
      .delete()
      .eq("id", contentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error al eliminar contenido ${contentId}:`, error);
    return false;
  }
};

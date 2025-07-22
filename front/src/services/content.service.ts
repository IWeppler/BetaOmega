import { AxiosError } from "axios";
import apiClient from "./api";
import {  IBookContent, ICreateBookContent, IUpdateBookContent } from "@/interfaces";



// Obtiene un capitulo del libro
export const getChapter = async (slug: string, chapterNumber: number) => {
    try {
      const response = await apiClient.get(
        `/books/${slug}/chapters/${chapterNumber}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener el capítulo ${chapterNumber} del libro "${slug}":`,
        error
      );
      return null;
    }
  };


// Crea un capítulo (contenido) nuevo.
export const createBookContent = async (contentData: ICreateBookContent): Promise<{ success: boolean; content?: IBookContent; error?: string | string[] }>  => {
    try {
      const response = await apiClient.post<IBookContent>(
        "/book-content",
        contentData
      );
      return { success: true, content: response.data };
    } catch (err) {
      const error = err as AxiosError<{ message?: string | string[] }>;
      return {
        success: false,
        error: error.response?.data?.message || "Error al crear el capítulo",
      };
    }
  };

// Sube una imagen al contenido
  export const uploadContentImage = async (
    imageFile: File
  ): Promise<{ success: boolean; url?: string; error?: string | string[] }> => {
    const formData = new FormData();
    formData.append("file", imageFile);
  
    try {
      const response = await apiClient.post<{ url: string }>(
        "/book-content/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return { success: true, url: response.data.url };
    } catch (err) {
      const error = err as AxiosError<{ message?: string | string[] }>;
      return {
        success: false,
        error: error.response?.data?.message || "Error al subir la imagen",
      };
    }
  };
  
// Actualiza un capítulo (contenido) existente.
export const updateContent = async (
    contentId: string,
    contentData: IUpdateBookContent
  ): Promise<IBookContent | null> => {
    try {
      const response = await apiClient.put<IBookContent>(`/book-content/${contentId}`, contentData);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string | string[] }>;
      console.error(`Error al actualizar el contenido "${contentId}":`, error.response?.data);
      return null;
    }
  };
  
  // Elimina un capítulo (contenido) por su ID.
  export const deleteContent = async (contentId: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/book-content/${contentId}`);
      return true;
    } catch (err) {
      const error = err as AxiosError<{ message?: string | string[] }>;
      console.error(`Error al eliminar el contenido "${contentId}":`, error.response?.data);
      return false;
    }
  };
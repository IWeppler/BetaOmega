import { AxiosError } from "axios";
import apiClient from "./api";
import { IBook, IBookContent } from "@/interfaces";

export const getAllBooks = async (): Promise<IBook[]> => {
  try {
    const response = await apiClient.get<IBook[]>("/books");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    return [];
  }
};

export const getBookBySlug = async (slug: string): Promise<IBook | null> => {
  try {
    const response = await apiClient.get<IBook>(`/books/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el libro "${slug}":`, error);
    return null;
  }
};

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

  export const createBook = async (bookData: IBook): Promise<{ success: boolean; book?: IBook; error?: string | string[] }> => {
    try {
      const response = await apiClient.post("/books", bookData);
      return { success: true, book: response.data };
    } catch (err) {
      const error = err as AxiosError<{ message?: string | string[] }>;
      return {
        success: false,
        error: error.response?.data?.message || "Error al crear el libro",
      };
    }
  };


export const uploadBookCover = async (
  coverFile: File
): Promise<{ success: boolean; url?: string; error?: string | string[] }> => {
  const formData = new FormData();
  formData.append("file", coverFile);

  try {
    const response = await apiClient.post<{ url: string }>(
      "/books/upload",
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

export const createBookContent = async (contentData: IBookContent): Promise<{ success: boolean; content?: IBookContent; error?: string | string[] }>  => {
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

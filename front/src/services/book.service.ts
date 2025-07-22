import { AxiosError } from "axios";
import apiClient from "./api";
import { IBook, ICreateBook, IUpdateBook } from "@/interfaces";


// Obtiene todos los libros
export const getAllBooks = async (): Promise<IBook[]> => {
  try {
    const response = await apiClient.get<IBook[]>("/books");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    return [];
  }
};


// Obtiene un libro por slug
export const getBookBySlug = async (slug: string): Promise<IBook | null> => {
  try {
    const response = await apiClient.get<IBook>(`/books/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el libro "${slug}":`, error);
    return null;
  }
};


// Obtiene un libro por ID
export const getBookById = async (bookId: string): Promise<IBook | null> => {
  try {
    const response = await apiClient.get<IBook>(`/books/id/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el libro "${bookId}":`, error);
    return null;
  }
};


// Crea un libro nuevo.
  export const createBook = async (bookData: ICreateBook): Promise<{ success: boolean; book?: IBook; error?: string | string[] }> => {
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



// Sube la imagen del nuevo libro
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


// Actualiza los datos de un libro existente.
export const updateBook = async (
  bookId: string,
  bookData: IUpdateBook
): Promise<IBook | null> => {
  try {
    const response = await apiClient.put<IBook>(`/books/id/${bookId}`, bookData);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string | string[] }>;
    console.error(`Error al actualizar el libro "${bookId}":`, error.response?.data);
    return null;
  }
};

// Elimina un libro por su ID.
export const deleteBook = async (bookId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/books/id/${bookId}`);
    return true;
  } catch (err) {
    const error = err as AxiosError<{ message?: string | string[] }>;
    console.error(`Error al eliminar el libro "${bookId}":`, error.response?.data);
    return false;
  }
};

// Intercambia el orden de dos libros.
export const reorderBooks = async (bookId1: string, bookId2: string): Promise<boolean> => {
  try {
    await apiClient.patch('/books/reorder', { bookId1, bookId2 });
    return true;
  } catch (err) {
    const error = err as AxiosError<{ message?: string | string[] }>;
    console.error(`Error al reordenar los libros:`, error.response?.data);
    return false;
  }
};
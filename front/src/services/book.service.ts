import { AxiosError } from "axios";
import apiClient from "./api";
import { IBook, ICreateBookContent, ICreateBook, IUpdateBook, IUpdateBookContent } from "@/interfaces";

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

export const getBookById = async (bookId: string): Promise<IBook | null> => {
  try {
    const response = await apiClient.get<IBook>(`/books/id/${bookId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el libro "${bookId}":`, error);
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

export const createBookContent = async (contentData: ICreateBookContent): Promise<{ success: boolean; content?: ICreateBookContent; error?: string | string[] }>  => {
  try {
    const response = await apiClient.post<ICreateBookContent>(
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


// Actualiza los datos de un libro existente.
export const updateBook = async (
  bookId: string,
  bookData: IUpdateBook
): Promise<IBook | null> => {
  try {
    const response = await apiClient.put<IBook>(`/books/${bookId}`, bookData);
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
    await apiClient.delete(`/books/${bookId}`);
    return true;
  } catch (err) {
    const error = err as AxiosError<{ message?: string | string[] }>;
    console.error(`Error al eliminar el libro "${bookId}":`, error.response?.data);
    return false;
  }
};




// Actualiza un capítulo (contenido) existente.

export const updateContent = async (
  contentId: string,
  contentData: IUpdateBookContent
): Promise<IUpdateBookContent | null> => {
  try {
    const response = await apiClient.put<IUpdateBookContent>(`/book-content/${contentId}`, contentData);
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
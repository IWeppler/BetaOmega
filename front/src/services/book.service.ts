import apiClient from './api';
import { IBook } from '@/interfaces';


export const getAllBooks = async (): Promise<IBook[]> => {
  try {
    const response = await apiClient.get<IBook[]>('/books');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los libros:', error);
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
      `/books/${slug}/chapters/${chapterNumber}`,
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener el capítulo ${chapterNumber} del libro "${slug}":`,
      error,
    );
    return null;
  }
};
import { create } from 'zustand';
import { getAllBooks, getBookBySlug } from '@/services/book.service';
import { IBook } from '@/interfaces';

interface BookState {
  books: IBook[];
  currentBook: IBook | null;
  loading: boolean;
  fetchAllBooks: () => Promise<void>;
  fetchBookBySlug: (slug: string) => Promise<void>;
  clearCurrentBook: () => void;
}

export const useBookStore = create<BookState>((set) => ({
  books: [],
  currentBook: null,
  loading: false,

  fetchAllBooks: async () => {
    set({ loading: true });
    try {
      const books = await getAllBooks();
      set({ books, loading: false });
    } catch (error) {
      console.error('Error al obtener todos los libros:', error);
      set({ loading: false });
    }
  },

  fetchBookBySlug: async (slug: string) => {
    set({ loading: true, currentBook: null });
    try {
      const book = await getBookBySlug(slug);
      set({ currentBook: book, loading: false });
    } catch (error) {
      console.error(`Error al obtener el libro ${slug}:`, error);
      set({ loading: false });
    }
  },

  clearCurrentBook: () => {
    set({ currentBook: null });
  },
}));

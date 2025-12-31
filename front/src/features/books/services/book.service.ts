import { supabase } from "@/lib/supabaseClient";
import { IBook, ICreateBook, IUpdateBook } from "@/interfaces";
import { getErrorMessage } from "@/shared/helper/getErrorMessage";

// ---------------------------------------------------------
// LECTURA (GET)
// ---------------------------------------------------------

// Obtiene todos los libros ordenados
export const getAllBooks = async (): Promise<IBook[]> => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;
    return data as IBook[];
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    return [];
  }
};

// Obtiene un libro por slug
export const getBookBySlug = async (slug: string): Promise<IBook | null> => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*, book_content(*)")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data as IBook;
  } catch (error) {
    console.error(`Error al obtener el libro "${slug}":`, error);
    return null;
  }
};

// Obtiene un libro por ID
export const getBookById = async (bookId: string): Promise<IBook | null> => {
  try {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("id", bookId)
      .single();

    if (error) throw error;
    return data as IBook;
  } catch (error) {
    console.error(`Error al obtener el libro ID ${bookId}:`, error);
    return null;
  }
};

// ---------------------------------------------------------
// ESCRITURA (CREATE / UPDATE / DELETE)
// ---------------------------------------------------------

// Crea un nuevo libro
export const createBook = async (bookData: ICreateBook) => {
  try {
    // Obtenemos el último orden para poner este al final
    const { data: lastBook } = await supabase
      .from("books")
      .select("order")
      .order("order", { ascending: false })
      .limit(1)
      .single();

    const newOrder = (lastBook?.order || 0) + 1;

    const { data, error } = await supabase
      .from("books")
      .insert({ ...bookData, order: newOrder })
      .select()
      .single();

    if (error) throw error;
    return { success: true, book: data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

// Actualiza un libro existente
export const updateBook = async (
  bookId: string,
  bookData: IUpdateBook
): Promise<IBook | null> => {
  try {
    const { data, error } = await supabase
      .from("books")
      .update(bookData)
      .eq("id", bookId)
      .select()
      .single();

    if (error) throw error;
    return data as IBook;
  } catch (error) {
    console.error(`Error al actualizar el libro "${bookId}":`, error);
    return null;
  }
};

// Elimina un libro
export const deleteBook = async (bookId: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("books").delete().eq("id", bookId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error al eliminar el libro "${bookId}":`, error);
    return false;
  }
};

// Intercambia orden
export const reorderBooks = async (id1: string, id2: string) => {
  try {
    const { data: books } = await supabase
      .from("books")
      .select("id, order")
      .in("id", [id1, id2]);

    if (!books || books.length !== 2) return false;

    const bookA = books.find((b) => String(b.id) === id1);
    const bookB = books.find((b) => String(b.id) === id2);

    if (!bookA || !bookB) return false;

    // Intercambio
    const { error: err1 } = await supabase
      .from("books")
      .update({ order: bookB.order })
      .eq("id", id1);

    const { error: err2 } = await supabase
      .from("books")
      .update({ order: bookA.order })
      .eq("id", id2);

    if (err1 || err2) throw new Error("Error al intercambiar orden");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// ---------------------------------------------------------
// STORAGE (IMÁGENES)
// ---------------------------------------------------------

export const uploadBookCover = async (
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    if (!file) throw new Error("No se ha seleccionado ningún archivo.");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("book-covers")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("book-covers")
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

export const getBooks = getAllBooks;

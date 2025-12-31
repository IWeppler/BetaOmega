"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, ArrowUp, ArrowDown, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button, ButtonGhost } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/ui/card";
import { IBook } from "@/interfaces";
import { reorderBooks } from "@/features/books/services/book.service";
import { routes } from "@/app/routes";
import { useIsMobile } from "@/hooks/use-mobile";

interface LibraryListProps {
  initialBooks: IBook[];
}

export const LibraryList = ({ initialBooks }: LibraryListProps) => {
  const [books, setBooks] = useState<IBook[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleRowClick = (book: IBook) => {
    router.push(`${routes.manager.library}/edit/${book.slug}`);
  };

  const handleReorder = async (
    currentIndex: number,
    direction: "up" | "down"
  ) => {
    if (loading) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= books.length) return;

    setLoading(true);

    const book1 = books[currentIndex];
    const book2 = books[newIndex];

    const newBooks = [...books];
    newBooks[currentIndex] = book2;
    newBooks[newIndex] = book1;
    const tempOrder = newBooks[currentIndex].order;
    newBooks[currentIndex].order = newBooks[newIndex].order;
    newBooks[newIndex].order = tempOrder;

    setBooks(newBooks);

    try {
      const success = await reorderBooks(String(book1.id), String(book2.id));
      if (!success) throw new Error("Falló el reordenamiento");
      toast.success("Orden actualizado");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el nuevo orden");
      setBooks(initialBooks);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de Acciones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Libros Publicados
          </h2>
          <p className="text-sm text-gray-500">
            Gestiona el contenido de lectura de la plataforma.
          </p>
        </div>
        <Link href={routes.manager.libraryNew}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Nuevo Libro</span>
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {books.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay libros creados aún.
            </div>
          ) : (
            <>
              {/* TABLA DESKTOP */}
              {!isMobile && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-3 font-medium text-center w-24">
                          Orden
                        </th>
                        <th className="px-6 py-3 font-medium w-20">Portada</th>
                        <th className="px-6 py-3 font-medium">Información</th>
                        <th className="px-6 py-3 font-medium text-center">
                          Capítulos
                        </th>
                        <th className="px-6 py-3 font-medium text-right">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {books.map((book, index) => (
                        <tr
                          key={book.id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          {/* Columna Orden */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-1">
                              <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  disabled={index === 0 || loading}
                                  onClick={() => handleReorder(index, "up")}
                                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  disabled={
                                    index === books.length - 1 || loading
                                  }
                                  onClick={() => handleReorder(index, "down")}
                                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="font-mono font-medium text-gray-400 w-6 text-center">
                                {index + 1}
                              </span>
                            </div>
                          </td>

                          {/* Columna Portada */}
                          <td className="px-6 py-4">
                            <div className="relative h-12 w-9 rounded overflow-hidden border border-gray-200 shadow-sm">
                              <Image
                                src={book.cover_url || "/placeholder-book.png"}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>

                          {/* Columna Info */}
                          <td className="px-6 py-4 max-w-md">
                            <div className="font-medium text-gray-900">
                              {book.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                              {book.description}
                            </div>
                          </td>

                          {/* Columna Caps */}
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {book.total_chapters} caps
                            </span>
                          </td>

                          {/* Columna Acciones */}
                          <td className="px-6 py-4 text-right">
                            <ButtonGhost
                              onClick={() => handleRowClick(book)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4 text-neutral-900" />
                            </ButtonGhost>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* LISTA MOBILE */}
              {isMobile && (
                <div className="divide-y divide-gray-100">
                  {books.map((book, index) => (
                    <div key={book.id} className="p-4 flex gap-4 items-center">
                      {/* Controles Reordenar Mobile */}
                      <div className="flex flex-col gap-2">
                        <button
                          disabled={index === 0 || loading}
                          onClick={() => handleReorder(index, "up")}
                          className="p-1.5 bg-gray-50 rounded border border-gray-200 disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          disabled={index === books.length - 1 || loading}
                          onClick={() => handleReorder(index, "down")}
                          className="p-1.5 bg-gray-50 rounded border border-gray-200 disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Info Libro */}
                      <div
                        className="flex-1 flex gap-3 items-center"
                        onClick={() => handleRowClick(book)}
                      >
                        <div className="relative h-16 w-12 rounded border border-gray-200 shadow-sm shrink-0 overflow-hidden bg-gray-100">
                          <Image
                            src={book.cover_url || "/placeholder-book.png"}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {book.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {book.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                              Cap {book.total_chapters}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

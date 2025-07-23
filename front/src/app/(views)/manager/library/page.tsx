"use client";

import { useEffect, useState } from "react";
import { useBookStore } from "@/app/Store/bookStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { reorderBooks } from "@/services/book.service";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { routes } from "@/app/routes";
import { IBook } from "@/interfaces";
import toast from "react-hot-toast";


export default function LibraryManagerPage() {
  const { books, fetchAllBooks } = useBookStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadBooks = async () => {
      await fetchAllBooks();
      setLoading(false);
    };
    loadBooks();
  }, [fetchAllBooks]);

  const handleRowClick = (book: IBook) => {
    router.push(`${routes.manager.library}/edit/${book.slug}`);
  };

  const handleReorder = async (book1Id: string, book2Id: string) => {
    const success = await reorderBooks(book1Id, book2Id);
    if (success) {
      toast.success("Orden actualizado");
      await fetchAllBooks();
    } else {
      toast.error("No se pudo actualizar el orden");
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <h1 className="font-semibold text-gray-900">Gestión de Libros</h1>
        <span className="text-gray-500">/</span>
        <span className="text-gray-500">Crea, edita y gestiona los libros de la plataforma.</span>
      </header>
      <div className="flex items-center justify-end p-4">
        <Link href={routes.manager.libraryNew}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Nuevo Libro
          </Button>
        </Link>
      </div>

      

      <Card className="flex-1 overflow-auto m-6">
        <CardHeader>
          <CardTitle>Biblioteca</CardTitle>
          <CardDescription>Lista de todos los libros publicados.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? 
          <div className="flex-1 flex items-center justify-center h-screen">
           <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
           </div> : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm font-semibold">
                    <th className="p-3">Orden</th>
                    <th className="p-3">Portada</th>
                    <th className="p-3">Título</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3">Capítulos</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 4. Añadimos 'index' al map para deshabilitar botones */}
                  {books.map((book, index) => (
                    <tr 
                      key={book.id} 
                      className="border-t text-sm hover:bg-gray-50"
                    >
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold w-6 text-center">{book.order}</span>
                          <div className="flex flex-col">
                            {/* 5. Lógica de los botones */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              disabled={index === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(book.id, books[index - 1].id);
                              }}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              disabled={index === books.length - 1}
                              onClick={(e) => {
                                e.stopPropagation(); 
                                handleReorder(book.id, books[index + 1].id);
                              }}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-2 cursor-pointer" onClick={() => handleRowClick(book)}>
                        <Image src={book.cover_url} alt={book.title} width={40} height={50} className="rounded object-cover"/>
                      </td>
                      <td className="p-3 font-medium cursor-pointer" onClick={() => handleRowClick(book)}>{book.title}</td>
                      <td className="p-3 text-muted-foreground truncate max-w-xs cursor-pointer" onClick={() => handleRowClick(book)}>{book.description}</td>
                      <td className="p-3 cursor-pointer" onClick={() => handleRowClick(book)}>{`${book.contents?.length || 0} / ${book.total_chapters}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
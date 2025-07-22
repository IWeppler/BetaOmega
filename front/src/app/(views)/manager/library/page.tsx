"use client";

import { useEffect, useState } from "react";
import { useBookStore } from "@/app/Store/bookStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/app/routes";

export default function LibraryManagerPage() {
  const { books, fetchAllBooks } = useBookStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      await fetchAllBooks();
      setLoading(false);
    };
    loadBooks();
  }, [fetchAllBooks]);

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
          {loading ? <p>Cargando libros...</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm font-semibold">
                    <th className="p-3">Portada</th>
                    <th className="p-3">Título</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3">Capítulos</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-t text-sm">
                      <td className="p-2">
                        <Image src={book.cover_url} alt={book.title} width={40} height={50} className="rounded object-cover"/>
                      </td>
                      <td className="p-3 font-medium">{book.title}</td>
                      <td className="p-3 text-muted-foreground truncate max-w-xs">{book.description}</td>
                      <td className="p-3">{book.contents?.length || 0} / {book.total_chapters}</td>
                      <td className="p-3">
                          <Link href={`${routes.manager.library}/edit/${book.slug}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
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

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookBySlug, updateBook, deleteBook } from "@/services/book.service";
import { IBook, IUpdateBook } from "@/interfaces";
import { BookDetailsForm } from "@/components/manager/BookDetailsForm";
import { ChapterManager } from "@/components/manager/ChapterManager";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params as { slug: string };

  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = useCallback(async () => {
    setLoading(true);
    const data = await getBookBySlug(slug);
    setBook(data);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleUpdateBook = async (data: IUpdateBook) => {
    if (!book) return;
    const updatedBook = await updateBook(book.id, data);
    if (updatedBook) {
      setBook(updatedBook);
      toast.success("¡Libro actualizado!");
      if (updatedBook.slug !== slug) {
        router.push(`/manager/library/edit/${updatedBook.slug}`);
      }
    } else {
      toast.error("Error al actualizar el libro.");
    }
  };

  const handleDeleteBook = async () => {
    if (!book) return;
    const success = await deleteBook(book.id);
    if (success) {
      toast.success("Libro eliminado con éxito.");
      router.push("/manager/library");
    } else {
      toast.error("Error al eliminar el libro.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Libro no encontrado</h2>
        <p className="text-muted-foreground">
          El libro que buscas no existe o fue eliminado.
        </p>
        <Button asChild className="mt-4">
          <Link href="/manager/library">Volver a la Biblioteca</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 h-full">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/manager/library">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestionar Libro</h1>
          <p className="text-muted-foreground">{book.title}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-156px)] overflow-y-auto">
        <div className="lg:col-span-2 space-y-6">
          <ChapterManager book={book} onChaptersChange={fetchBook} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <BookDetailsForm book={book} onSave={handleUpdateBook} />
          
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Zona de Peligro</CardTitle>
              <CardDescription>
                Esta acción es permanente y no se puede deshacer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Eliminar Libro
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminará permanentemente el libro {book.title} y todos sus capítulos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={handleDeleteBook}
                    >
                      Sí, eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

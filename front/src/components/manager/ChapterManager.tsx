"use client";

import { useState } from "react";
import { IBook, ICreateBookContent } from "@/interfaces";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import { createBookContent, deleteContent } from "@/services/book.service";
import { RichTextEditor } from "../TextEditor";

interface Props {
  book: IBook;
  onChaptersChange: () => void;
}

export const ChapterManager = ({ book, onChaptersChange }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { title: "", md_content: "" },
    validationSchema: Yup.object({
      title: Yup.string().required("El título es requerido."),
      md_content: Yup.string().required("El contenido es requerido."),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      const newChapterNumber = (book.contents?.length || 0) + 1;

      const newChapterData: ICreateBookContent = {
        book_id: book.id,
        chapter_number: newChapterNumber,
        title: values.title,
        md_content: values.md_content,
      };

      const result = await createBookContent(newChapterData);

      if (result.success) {
        toast.success(`Capítulo ${newChapterNumber} creado.`);
        resetForm();
        onChaptersChange();
      } else {
        toast.error(`Error: ${result.error}`);
      }
      setIsSubmitting(false);
    },
  });

  const handleDeleteChapter = async (chapterId: string, chapterTitle: string) => {
    const success = await deleteContent(chapterId);
    if (success) {
      toast.success(`Capítulo "${chapterTitle}" eliminado.`);
      onChaptersChange();
    } else {
      toast.error("Error al eliminar el capítulo.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Capítulos Existentes</CardTitle>
          <CardDescription>
            Gestiona los capítulos de tu libro. Actualmente hay {book.contents?.length || 0} de {book.total_chapters} capítulos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {book.contents.map((chapter) => (
              <li key={chapter.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <span className="font-medium">
                  Cap. {chapter.chapter_number}: {chapter.title}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente el capítulo {chapter.title}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteChapter(chapter.id, chapter.title)}>
                          Sí, eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
            {book.contents.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Aún no hay capítulos.</p>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* --- FORMULARIO PARA AÑADIR NUEVO CAPÍTULO (Con Editor) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nuevo Capítulo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Título del Capítulo</label>
              <Input id="title" {...formik.getFieldProps("title")} />
              {formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>}
            </div>
            
            {/* --- 2. REEMPLAZAMOS EL TEXTAREA POR EL EDITOR --- */}
            <div>
              <label className="block text-sm font-medium mb-1">Contenido</label>
              <RichTextEditor
                content={formik.values.md_content}
                onChange={(newContent) => {
                  // 3. Conectamos el `onChange` del editor al estado de Formik
                  formik.setFieldValue("md_content", newContent);
                }}
              />
              {formik.touched.md_content && formik.errors.md_content && <p className="text-red-500 text-xs mt-1">{formik.errors.md_content}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Capítulo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

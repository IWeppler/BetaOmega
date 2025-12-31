"use client";

import { useState } from "react";
import {
  IBook,
  IBookContent,
  ICreateBookContent,
  IUpdateBookContent,
} from "@/interfaces";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
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
} from "@/shared/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import {
  createBookContent,
  deleteContent,
  updateContent,
} from "@/services/content.service";
import { RichTextEditor } from "../../shared/components/TextEditor";
import { TextInput } from "@/shared/ui/Input";

interface Props {
  book: IBook;
  onChaptersChange: () => void;
}

export const ChapterManager = ({ book, onChaptersChange }: Props) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingChapter, setEditingChapter] = useState<IBookContent | null>(
    null
  );

  // Formulario para CREAR un nuevo capítulo
  const createFormik = useFormik({
    initialValues: { title: "", md_content: "" },
    validationSchema: Yup.object({
      title: Yup.string().required("El título es requerido."),
      md_content: Yup.string().required("El contenido es requerido."),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsCreating(true);
      const newChapterData: ICreateBookContent = {
        book_id: book.id,
        chapter_number: (book.book_content?.length || 0) + 1,
        title: values.title,
        md_content: values.md_content,
      };

      const result = await createBookContent(newChapterData);
      if (result.success) {
        toast.success(`Capítulo creado.`);
        resetForm();
        onChaptersChange();
      } else {
        toast.error(`Error: ${result.error}`);
      }
      setIsCreating(false);
    },
  });

  // Formulario para EDITAR un capítulo existente
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: editingChapter?.title || "",
      md_content: editingChapter?.md_content || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("El título es requerido."),
    }),
    onSubmit: async (values) => {
      if (!editingChapter) return;

      const result = await updateContent(
        editingChapter.id,
        values as IUpdateBookContent
      );
      if (result) {
        toast.success(`Capítulo actualizado.`);
        setEditingChapter(null);
        onChaptersChange();
      } else {
        toast.error(`Error al actualizar el capítulo.`);
      }
    },
  });

  const handleDeleteChapter = async (
    chapterId: number,
    chapterTitle: string
  ) => {
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
      {/* SECCIÓN DE CAPÍTULOS EXISTENTES */}
      <Card>
        <CardHeader>
          <CardTitle>Capítulos Existentes</CardTitle>
          <CardDescription>
            Actualmente hay {book.book_content?.length || 0} de{" "}
            {book.total_chapters} capítulos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {book.book_content?.map((chapter) => (
              <li
                key={chapter.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-muted/20"
              >
                <span className="font-medium">
                  Cap. {chapter.chapter_number}: {chapter.title}
                </span>
                <div className="flex items-center gap-2">
                  {/* --- MODAL DE EDICIÓN --- */}
                  <Dialog
                    open={editingChapter?.id === chapter.id}
                    onOpenChange={(isOpen) =>
                      !isOpen && setEditingChapter(null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        //variant="outline"
                        //size="icon"
                        onClick={() => setEditingChapter(chapter)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>
                          Editando: Cap. {chapter.chapter_number}
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={editFormik.handleSubmit}
                        className="space-y-4 py-4"
                      >
                        <div>
                          <label
                            htmlFor="editTitle"
                            className="block text-sm font-medium mb-1"
                          >
                            Título del Capítulo
                          </label>
                          <TextInput
                            id="editTitle"
                            {...editFormik.getFieldProps("title")}
                          />
                          {editFormik.touched.title &&
                            editFormik.errors.title && (
                              <p className="text-red-500 text-xs mt-1">
                                {editFormik.errors.title}
                              </p>
                            )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Contenido
                          </label>
                          <RichTextEditor
                            content={editFormik.values.md_content}
                            onChange={(newContent) =>
                              editFormik.setFieldValue("md_content", newContent)
                            }
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={editFormik.isSubmitting}
                        >
                          {editFormik.isSubmitting
                            ? "Guardando..."
                            : "Guardar Cambios"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* --- DIÁLOGO DE ELIMINACIÓN --- */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                      //variant="destructive" size="icon"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará
                          permanentemente el capítulo &quot;{chapter.title}
                          &quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteChapter(chapter.id, chapter.title)
                          }
                        >
                          Sí, eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
            {book.book_content?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aún no hay capítulos.
              </p>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* SECCIÓN PARA AÑADIR NUEVO CAPÍTULO */}
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nuevo Capítulo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createFormik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Título del Capítulo
              </label>
              <TextInput id="title" {...createFormik.getFieldProps("title")} />
              {createFormik.touched.title && createFormik.errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {createFormik.errors.title}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contenido
              </label>
              <RichTextEditor
                content={createFormik.values.md_content}
                onChange={(newContent) =>
                  createFormik.setFieldValue("md_content", newContent)
                }
              />
              {createFormik.touched.md_content &&
                createFormik.errors.md_content && (
                  <p className="text-red-500 text-xs mt-1">
                    {createFormik.errors.md_content}
                  </p>
                )}
            </div>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Guardando..." : "Guardar Capítulo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { uploadBookCover, createBook } from "@/services/book.service";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { toast } from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { ICreateBook } from "@/interfaces";
import { routes } from "@/app/routes";

// Esquema de validación
const NewBookSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Debe tener al menos 3 caracteres")
    .required("El título es requerido"),
  slug: Yup.string()
    .required("El slug es requerido")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  description: Yup.string().required("La descripción es requerida"),
  total_chapters: Yup.number()
    .min(1, "Debe haber al menos 1 capítulo")
    .required("El total de capítulos es requerido"),
});

export const BookCreateForm = () => {
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (
    values: ICreateBook,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!coverFile) {
      toast.error("Por favor, sube una imagen de portada.");
      setSubmitting(false);
      return;
    }

    // 1. Subir Portada
    const uploadResult = await uploadBookCover(coverFile);

    if (!uploadResult.success || !uploadResult.url) {
      toast.error(`Error al subir la portada: ${uploadResult.error}`);
      setSubmitting(false);
      return;
    }

    // 2. Crear Libro
    const bookData = {
      ...values,
      cover_url: uploadResult.url,
    };

    const createResult = await createBook(bookData);

    if (createResult.success && createResult.book) {
      toast.success(`Libro "${createResult.book.title}" creado con éxito.`);
      router.push(`${routes.manager.library}/edit/${createResult.book.slug}`);
      router.refresh();
    } else {
      toast.error(`Error al crear el libro: ${createResult.error}`);
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        title: "",
        slug: "",
        description: "",
        total_chapters: 1,
        cover_url: "",
      }}
      validationSchema={NewBookSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda: Metadatos */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Libro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Título */}
                  <div className="space-y-2">
                    <TextInput
                      name="title"
                      label="Título"
                      placeholder="Ej: Introducción a la Biblia"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <TextInput
                      name="slug"
                      label="Slug (URL)"
                      placeholder="ejemplo-de-slug-unico"
                    />
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Field
                      as={Textarea}
                      name="description"
                      id="description"
                      className="resize-none"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-xs text-red-500"
                    />
                  </div>

                  {/* Capítulos */}
                  <div className="space-y-2">
                    <TextInput
                      name="total_chapters"
                      label="Número Total de Capítulos"
                      type="number"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Columna Derecha: Imagen de Portada */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Imagen de Portada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label
                      htmlFor="cover-upload"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      {coverPreview ? (
                        <div className="relative w-full h-full p-2">
                          <Image
                            src={coverPreview}
                            alt="Vista previa"
                            fill
                            className="object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-4 text-slate-400" />
                          <p className="mb-2 text-sm text-slate-500 text-center">
                            <span className="font-semibold">
                              Click para subir
                            </span>
                            <br />o arrastra y suelta
                          </p>
                          <p className="text-xs text-slate-400">
                            PNG, JPG, WEBP (MAX. 800x400px)
                          </p>
                        </div>
                      )}
                    </Label>
                    <input
                      id="cover-upload"
                      name="cover"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Libro y Añadir Contenido"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

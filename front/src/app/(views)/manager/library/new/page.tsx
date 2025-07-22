"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { uploadBookCover, createBook } from "@/services/book.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import Image from "next/image";
import { ICreateBook } from "@/interfaces";
import { routes } from "@/app/routes";

// Esquema de validación con Yup para el formulario
const NewBookSchema = Yup.object().shape({
  title: Yup.string().min(3, "Debe tener al menos 3 caracteres").required("El título es requerido"),
  slug: Yup.string()
    .required("El slug es requerido")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  description: Yup.string().required("La descripción es requerida"),
  total_chapters: Yup.number().min(1, "Debe haber al menos 1 capítulo").required("El total de capítulos es requerido"),
});

export default function CreateBookPage() {
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

    const handleSubmit = async (values: ICreateBook, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    if (!coverFile) {
      toast.error("Por favor, sube una imagen de portada.");
      setSubmitting(false);
      return;
    }

    const uploadResult = await uploadBookCover(coverFile);

    if (!uploadResult.success || !uploadResult.url) {
      toast.error(`Error al subir la portada: ${uploadResult.error}`);
      setSubmitting(false);
      return;
    }

    const bookData = {
      ...values,
      cover_url: uploadResult.url,
    };

    const createResult = await createBook(bookData);

    if (createResult.success && createResult.book) {
      toast.success(`Libro "${createResult.book.title}" creado con éxito.`);
      router.push(`${routes.manager.library}/edit/${createResult.book.slug}`);
    } else {
      toast.error(`Error al crear el libro: ${createResult.error}`);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/manager/library">
            <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold">Crear Nuevo Libro</h1>
            <p className="text-muted-foreground">Completa los detalles para añadir un nuevo libro a la biblioteca.</p>
        </div>
      </div>

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
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Field as={Input} name="title" id="title" />
                      <ErrorMessage name="title" component="p" className="text-xs text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Field as={Input} name="slug" id="slug" placeholder="ejemplo-de-slug-unico" />
                      <ErrorMessage name="slug" component="p" className="text-xs text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Field as={Textarea} name="description" id="description" />
                      <ErrorMessage name="description" component="p" className="text-xs text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total_chapters">Número Total de Capítulos</Label>
                      <Field as={Input} type="number" name="total_chapters" id="total_chapters" />
                      <ErrorMessage name="total_chapters" component="p" className="text-xs text-red-500" />
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
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
                      >
                        {coverPreview ? (
                            <Image src={coverPreview} alt="Vista previa" width={200} height={260} className="object-contain h-full w-full"/>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 800x400px)</p>
                            </div>
                        )}
                      </Label>
                      <Input id="cover-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creando Libro...' : 'Crear Libro y Añadir Contenido'}
                </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

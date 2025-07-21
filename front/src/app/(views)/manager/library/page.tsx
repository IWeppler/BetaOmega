"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { uploadBookCover, createBook } from "@/services/book.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { IBook } from "@/interfaces";
import { useRouter } from "next/navigation";

export default function CreateBookPage() {
  const router = useRouter();
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      slug: "",
      description: "",
      total_chapters: 0,
    },
    onSubmit: async (values) => {
      if (!coverFile) {
        toast.error("Por favor, sube una imagen de portada.");
        return;
      }

      // 1. Subir la imagen de portada
      const uploadResult = await uploadBookCover(coverFile);

      if (!uploadResult.success) {
        toast.error(`Error al subir la portada: ${uploadResult.error}`);
        return;
      }

      // 2. Crear el libro con la URL de la imagen devuelta por la API
      const bookData = {
        ...values,
        cover_url: uploadResult.url,
      };

      const createResult = await createBook(bookData as IBook);

      if (createResult.success && createResult.book) {
        toast.success(`Libro "${createResult.book.title}" creado con éxito.`);
        // Redirigir a la página de edición de capítulos
        router.push(`/manager/library/${createResult.book.id}`);
      } else {
        toast.error(`Error al crear el libro: ${createResult.error}`);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <h1 className="font-semibold text-gray-900">Gestión de Libros</h1>
        <span className="text-gray-500">/</span>
        <span className="text-gray-500">Libros</span>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-[#f9f7f5] to-white">
        <Input
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
          placeholder="Título"
        />
        <Input
          name="slug"
          onChange={formik.handleChange}
          value={formik.values.slug}
          placeholder="Slug (ej: mi-libro-nuevo)"
        />
        <Input
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
          placeholder="Descripción"
        />
        <Input
          name="total_chapters"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.total_chapters}
          placeholder="Total de Capítulos"
        />

        <div>
          <label>Imagen de Portada</label>
          <Input
            type="file"
            onChange={(e) =>
              setCoverFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
      </main>
      <Button type="submit">Crear Libro</Button>
    </form>
  );
}

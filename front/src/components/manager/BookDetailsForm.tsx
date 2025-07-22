// src/components/manager/BookDetailsForm.tsx
"use client";

import { IBook, IUpdateBook } from "@/interfaces";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  book: IBook;
  onSave: (data: IUpdateBook) => Promise<void>;
}

export const BookDetailsForm = ({ book, onSave }: Props) => {
  const formik = useFormik({
    initialValues: {
      title: book.title,
      description: book.description,
      slug: book.slug,
    },
    validationSchema: Yup.object({
      // ... tus validaciones ...
    }),
    onSubmit: async (values) => {
      await onSave(values);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Libro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title">Título</label>
            <Input id="title" {...formik.getFieldProps("title")} />
          </div>
          <div>
            <label htmlFor="slug">Slug</label>
            <Input id="slug" {...formik.getFieldProps("slug")} />
          </div>
          <div>
            <label htmlFor="description">Descripción</label>
            <Textarea id="description" {...formik.getFieldProps("description")} />
          </div>
          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
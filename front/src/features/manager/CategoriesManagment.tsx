"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ICategory } from "@/interfaces";
import { Button, ButtonGhost } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Edit2, X, Check, Palette } from "lucide-react";
import { useRouter } from "next/navigation";

const PREDEFINED_COLORS = [
  "bg-red-200 text-red-800 border-red-400",
  "bg-green-200 text-green-800 border-green-400",
  "bg-blue-200 text-blue-800 border-blue-400",
  "bg-purple-200 text-purple-800 border-purple-400",
  "bg-yellow-200 text-yellow-800 border-yellow-400",
  "bg-indigo-200 text-indigo-800 border-indigo-400",
  "bg-pink-200 text-pink-800 border-pink-400",
  "bg-orange-200 text-orange-800 border-orange-400",
];

interface Props {
  initialCategories: ICategory[];
}

export const CategoriesManagement = ({ initialCategories }: Props) => {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Estado para creación
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para edición
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  // --- CREAR ---
  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    setIsSubmitting(true);
    const randomColor =
      PREDEFINED_COLORS[Math.floor(Math.random() * PREDEFINED_COLORS.length)];

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: newCategoryName,
          color_class: randomColor,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success("Categoría creada");
      setNewCategoryName("");

      if (data) {
        setCategories((prev) => [...prev, data as ICategory]);
      }

      router.refresh();
    } catch (error) {
      let message = "Error al crear";
      if (error instanceof Error) message = error.message;
      else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = (error as { message: string }).message;
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- EDITAR ---
  const startEditing = (category: ICategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color_class);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
    setEditColor("");
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return toast.error("El nombre es requerido");

    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: editName, color_class: editColor })
        .eq("id", editingId);

      if (error) {
        throw error;
      }

      toast.success("Categoría actualizada");

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingId
            ? { ...cat, name: editName, color_class: editColor }
            : cat
        )
      );

      cancelEditing();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar");
    }
  };

  // --- ELIMINAR ---
  const handleDelete = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "No tienes permisos para eliminar esta categoría (RLS Block)."
        );
      }

      toast.success("Categoría eliminada");

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      router.refresh();
    } catch (error) {
      let message = "No se pudo eliminar";
      if (error instanceof Error) message = error.message;
      else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = (error as { message: string }).message;
      }
      toast.error(message);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
          <div className="flex-1">
            <TextInput
              name="catName"
              label="Nombre"
              placeholder="Ej: Anuncios Importantes"
              value={newCategoryName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCategoryName(e.target.value)
              }
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <span className="animate-pulse">...</span>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Crear
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Listado de Categorías */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          Categorías Existentes ({categories.length})
        </h3>

        <div className="grid gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`p-4 bg-white border rounded-lg shadow-sm transition-all ${
                editingId === cat.id
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-slate-200"
              }`}
            >
              {editingId === cat.id ? (
                // --- MODO EDICIÓN ---
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full">
                    <div className="flex-1 w-full">
                      <label className="text-xs text-slate-500 font-bold mb-1 block">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="w-full sm:w-auto">
                      <label className="text-xs text-slate-500 font-bold mb-1 flex items-center gap-1">
                        <Palette className="w-3 h-3" /> Color
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {PREDEFINED_COLORS.map((colorClass) => (
                          <button
                            key={colorClass}
                            onClick={() => setEditColor(colorClass)}
                            className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                              colorClass.split(" ")[0]
                            } ${
                              editColor === colorClass
                                ? "border-slate-800 scale-110 shadow-sm"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                            title="Seleccionar color"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-100">
                    <ButtonGhost
                      onClick={cancelEditing}
                      className="text-slate-500"
                    >
                      <X className="w-4 h-4 mr-1" /> Cancelar
                    </ButtonGhost>
                    <Button
                      onClick={handleUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" /> Guardar
                    </Button>
                  </div>
                </div>
              ) : (
                // --- MODO VISUALIZACIÓN ---
                <div className="flex items-center justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Badge
                      className={`w-fit px-3 py-1 text-sm border ${cat.color_class}`}
                    >
                      {cat.name}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEditing(cat)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Editar categoría"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás completamente seguro?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará la
                            categoría{" "}
                            <span className="font-bold text-slate-900">
                              &quot;{cat.name}&quot;
                            </span>
                            .
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(cat.id)}
                            className="bg-red-600 hover:bg-red-700 text-white border-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

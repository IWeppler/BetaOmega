"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Layers,
  Settings2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { CategoryModal } from "@/features/manager/CategoryModal";
import { LevelManagerModal } from "@/features/manager/LevelManagerModal";

// IMPORTAR CONFIGURACIÓN DE TEMA
import {
  getTheme,
  getIconComponent,
} from "@/features/training/utils/themeConfig";

interface ICategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  // Nuevos campos
  color?: string;
  icon_key?: string;
}

interface Props {
  initialCategories: ICategory[];
}

export const TrainingManager = ({ initialCategories }: Props) => {
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);

  // Modales
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isLevelsModalOpen, setIsLevelsModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );

  // --- ACCIONES ---

  const handleDelete = async (id: number) => {
    if (
      !confirm("¿Estás seguro de eliminar este módulo y todas sus preguntas?")
    )
      return;

    const { error } = await supabase
      .from("training_modules")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar");
      console.error(error);
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoría eliminada");
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditModal = (category: ICategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySaved = (newCategory: ICategory, isEdit: boolean) => {
    if (isEdit) {
      setCategories((prev) =>
        prev.map((c) => (c.id === newCategory.id ? newCategory : c))
      );
    } else {
      setCategories((prev) => [...prev, newCategory]);
    }
    setIsCategoryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/training"
              className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Gestor de Entrenamiento
              </h1>
              <p className="text-slate-500 text-sm">
                Administra módulos y preguntas
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* BOTÓN GESTIONAR NIVELES */}
            <button
              onClick={() => setIsLevelsModalOpen(true)}
              className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95"
            >
              <Settings2 className="w-5 h-5 text-slate-500" />
              Niveles
            </button>

            {/* BOTÓN NUEVA CATEGORÍA */}
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 cursor-pointer text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Nueva Categoría
            </button>
          </div>
        </div>

        {/* LISTA DE CATEGORÍAS */}
        <div className="grid grid-cols-1 gap-4">
          {categories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No hay categorías creadas aún.</p>
            </div>
          ) : (
            categories.map((cat) => {
              // Obtenemos estilos dinámicos
              const theme = getTheme(cat.color || "slate");
              const IconComponent = getIconComponent(
                cat.icon_key || "sparkles"
              );

              return (
                <div
                  key={cat.id}
                  className={`bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between group transition-all hover:shadow-md ${theme.border}`}
                >
                  <div className="flex items-center gap-4">
                    {/* ÍCONO DINÁMICO */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme.bgIcon} ${theme.text}`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div>
                      <h3
                        className={`font-bold text-lg ${theme.text.replace(
                          "text-",
                          "text-slate-800 group-hover:text-"
                        )}`}
                      >
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex gap-2">
                        <span>ID: {cat.id}</span>
                        <span>•</span>
                        <span>
                          {new Date(cat.created_at).toLocaleDateString()}
                        </span>
                        {cat.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">
                              {cat.description}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/manager/training-manager/${cat.id}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors mr-2"
                    >
                      Gestionar Preguntas
                    </Link>

                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL CATEGORÍA */}
      {isCategoryModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleCategorySaved}
        />
      )}

      {/* MODAL NIVELES */}
      {isLevelsModalOpen && (
        <LevelManagerModal onClose={() => setIsLevelsModalOpen(false)} />
      )}
    </div>
  );
};

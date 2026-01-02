"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ICON_MAP, COLOR_THEMES } from "@/features/training/utils/themeConfig";
import { getErrorMessage } from "@/shared/helper/getErrorMessage";

interface ICategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  color?: string; // Nuevo campo
  icon_key?: string; // Nuevo campo
}

interface Props {
  category: ICategory | null;
  onClose: () => void;
  onSave: (cat: ICategory, isEdit: boolean) => void;
}

export const CategoryModal = ({ category, onClose, onSave }: Props) => {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");

  // Estados para color e icono (con defaults)
  const [color, setColor] = useState(category?.color || "slate");
  const [iconKey, setIconKey] = useState(category?.icon_key || "sparkles");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("El nombre es obligatorio");

    setLoading(true);

    // Objeto con los datos a guardar
    const payload = { name, description, color, icon_key: iconKey };

    try {
      if (category) {
        const { data, error } = await supabase
          .from("training_modules")
          .update(payload)
          .eq("id", category.id)
          .select()
          .single();

        if (error) throw error;
        toast.success("Categoría actualizada");
        onSave(data, true);
      } else {
        const { data, error } = await supabase
          .from("training_modules")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        toast.success("Categoría creada");
        onSave(data, false);
      }
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">
            {category ? "Editar Módulo" : "Nuevo Módulo"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto p-6 flex-1">
          <form id="cat-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nombre del Módulo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Ej: Biblia, Historia..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Selector de Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Color del Tema
                </label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona color" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(COLOR_THEMES).map((key) => {
                      const theme = COLOR_THEMES[key];
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${theme.bgIcon
                                .replace("bg-", "bg-")
                                .replace("-100", "-500")}`}
                            />
                            <span className="capitalize">{key}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Selector de Ícono */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ícono Representativo
                </label>
                <Select value={iconKey} onValueChange={setIconKey}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona ícono" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="max-h-[200px] overflow-y-auto">
                      {Object.keys(ICON_MAP).map((key) => {
                        const IconComp = ICON_MAP[key];
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <IconComp className="w-4 h-4 text-slate-500" />
                              <span className="capitalize">{key}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vista Previa Visual (Opcional pero útil) */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
              <div
                className={`p-3 rounded-xl shadow-sm ${COLOR_THEMES[color]?.bgIcon} ${COLOR_THEMES[color]?.text}`}
              >
                {(() => {
                  const Icon = ICON_MAP[iconKey];
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              <div>
                <h4
                  className={`font-bold ${
                    COLOR_THEMES[color]?.text || "text-slate-900"
                  }`}
                >
                  {name || "Nombre del Módulo"}
                </h4>
                <span className="text-xs text-slate-400">
                  Vista previa del estilo
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px]"
                placeholder="Breve descripción del contenido..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="cat-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {category ? "Guardar Cambios" : "Crear Módulo"}
          </button>
        </div>
      </div>
    </div>
  );
};

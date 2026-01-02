"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Loader2, Plus, Trash2, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { getErrorMessage } from "@/shared/helper/getErrorMessage";

interface ILevel {
  id?: number;
  value: string;
  label: string;
  color: string;
  order: number;
  min_xp: number;
  xp_reward: number;
}

interface Props {
  onClose: () => void;
}

// Lista de colores
const COLORS = [
  { label: "Verde", value: "green", tw: "bg-green-500" },
  { label: "Azul", value: "blue", tw: "bg-blue-500" },
  { label: "Rojo", value: "red", tw: "bg-red-500" },
  { label: "Amarillo", value: "yellow", tw: "bg-yellow-500" },
  { label: "Violeta", value: "purple", tw: "bg-purple-500" },
  { label: "Naranja", value: "orange", tw: "bg-orange-500" },
  { label: "Rosa", value: "pink", tw: "bg-pink-500" },
  { label: "Cian", value: "cyan", tw: "bg-cyan-500" },
  { label: "Lima", value: "lime", tw: "bg-lime-500" },
  { label: "Esmeralda", value: "emerald", tw: "bg-emerald-500" },
  { label: "Indigo", value: "indigo", tw: "bg-indigo-500" },
  { label: "Fucsia", value: "fuchsia", tw: "bg-fuchsia-500" },
  { label: "Gris", value: "slate", tw: "bg-slate-500" },
  { label: "Negro", value: "black", tw: "bg-slate-900" },
];

export const LevelManagerModal = ({ onClose }: Props) => {
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    const { data, error } = await supabase
      .from("difficulty_levels")
      .select("*")
      .order("min_xp", { ascending: true });

    if (error) {
      toast.error("Error cargando niveles");
    } else {
      setLevels(data || []);
    }
    setLoading(false);
  };

  const handleAddLevel = () => {
    const lastLevel = levels[levels.length - 1];
    const newOrder = lastLevel ? lastLevel.order + 1 : 1;
    const newMinXp = lastLevel ? lastLevel.min_xp + 500 : 0;
    const newReward = lastLevel ? lastLevel.xp_reward + 5 : 10;

    setLevels([
      ...levels,
      {
        value: "",
        label: "",
        color: "slate",
        order: newOrder,
        min_xp: newMinXp,
        xp_reward: newReward,
      },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof ILevel,
    newVal: string | number
  ) => {
    const newLevels = [...levels];

    newLevels[index] = { ...newLevels[index], [field]: newVal } as ILevel;

    if (field === "label" && !newLevels[index].id) {
      newLevels[index].value = (newVal as string)
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
    }

    setLevels(newLevels);
  };

  const handleDelete = async (index: number, id?: number) => {
    if (id) {
      if (
        !confirm(
          "Si borras este nivel, afectará a la progresión del juego. ¿Seguir?"
        )
      )
        return;
      await supabase.from("difficulty_levels").delete().eq("id", id);
    }
    const newLevels = [...levels];
    newLevels.splice(index, 1);
    setLevels(newLevels);
  };

  const handleSaveAll = async () => {
    if (levels.some((l) => !l.label || !l.color)) {
      return toast.error("Todos los niveles deben tener nombre y color");
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("difficulty_levels")
        .upsert(levels, { onConflict: "id" });

      if (error) throw error;

      toast.success("Configuración de niveles guardada");
      onClose();
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              Gestión de Niveles y XP
            </h3>
            <p className="text-xs text-slate-500">
              Define la curva de dificultad y las recompensas del juego
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 bg-slate-50/50">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Cabecera de tabla */}
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 px-2 uppercase tracking-wider text-center">
                <div className="col-span-1">Orden</div>
                <div className="col-span-3 text-left pl-2">Nivel</div>
                <div className="col-span-2">XP Requerida</div>
                <div className="col-span-2">Premio (XP)</div>
                <div className="col-span-3">Color</div>
                <div className="col-span-1"></div>
              </div>

              {levels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors"
                >
                  {/* Orden */}
                  <div className="col-span-1">
                    <input
                      type="number"
                      className="w-full text-center bg-slate-50 border border-slate-200 rounded py-1.5 focus:border-indigo-500 focus:outline-none font-mono text-sm"
                      value={lvl.order}
                      onChange={(e) =>
                        handleChange(idx, "order", parseInt(e.target.value))
                      }
                    />
                  </div>

                  {/* Label */}
                  <div className="col-span-3">
                    <input
                      type="text"
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-indigo-500 font-medium text-sm"
                      placeholder="Ej: Maestro"
                      value={lvl.label}
                      onChange={(e) =>
                        handleChange(idx, "label", e.target.value)
                      }
                    />
                  </div>

                  {/* Min XP (Requerida) */}
                  <div className="col-span-2 relative">
                    <input
                      type="number"
                      className="w-full text-center bg-slate-50 border border-slate-200 rounded py-1.5 focus:border-indigo-500 focus:outline-none font-mono text-sm text-slate-700 font-bold"
                      value={lvl.min_xp}
                      onChange={(e) =>
                        handleChange(idx, "min_xp", parseInt(e.target.value))
                      }
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
                      XP
                    </span>
                  </div>

                  {/* XP Reward (Premio) */}
                  <div className="col-span-2 relative">
                    <input
                      type="number"
                      className="w-full text-center bg-green-50 border border-green-200 rounded py-1.5 focus:border-green-500 focus:outline-none font-mono text-sm text-green-700 font-bold"
                      value={lvl.xp_reward}
                      onChange={(e) =>
                        handleChange(idx, "xp_reward", parseInt(e.target.value))
                      }
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-green-600/50 pointer-events-none">
                      +XP
                    </span>
                  </div>

                  {/* Color */}
                  <div className="col-span-3">
                    <Select
                      value={lvl.color}
                      onValueChange={(val) => handleChange(idx, "color", val)}
                    >
                      <SelectTrigger className="w-full h-9 bg-slate-50 border-slate-200">
                        <SelectValue placeholder="Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full shadow-sm ${c.tw}`}
                              />
                              <span className="text-sm">{c.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleDelete(idx, lvl.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddLevel}
                className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 font-medium text-sm mt-4"
              >
                <Plus className="w-4 h-4" /> Agregar Nuevo Nivel
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

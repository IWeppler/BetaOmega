"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Sparkles, Trophy } from "lucide-react";
import { TrainingGame } from "@/features/training/TrainingGame";
import { MobileHeader } from "@/shared/components/MobileHeader";
import { getTheme, getIconComponent } from "./utils/themeConfig";
import { IUser } from "@/interfaces";

export interface ICategory {
  id: number;
  name: string;
  created_at: string;
  color?: string;
  icon_key?: string;
  description?: string;
}

export interface IMastery {
  id: number;
  user_id: string;
  category_id: number;
  xp: number;
  current_rank: string;
  games_played: number;
}

interface TrainingDashboardProps {
  categories: ICategory[];
  masteries: Record<number, IMastery>;
  user: IUser | null;
  isAdmin: boolean;
}

export const TrainingDashboard = ({
  categories,
  masteries,
  isAdmin,
}: TrainingDashboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );

  // --- MODO JUEGO ---
  if (selectedCategory) {
    const mastery = masteries[selectedCategory.id];

    return (
      <div className="h-full w-full overflow-y-auto bg-slate-50 p-4 md:p-8 animate-in fade-in duration-300">
        <div className="max-w-5xl mx-auto pb-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className="group flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
          >
            <div className="p-2 bg-white rounded-full shadow-sm mr-2 group-hover:shadow-md transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Volver a Ramas
          </button>
          {/* Pasamos los datos del módulo para estilos dinámicos */}
          <TrainingGame category={selectedCategory} initialMastery={mastery} />
        </div>
      </div>
    );
  }

  // --- MODO DASHBOARD ---
  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50/50">
      <MobileHeader
        title="Centro de Sabiduría"
        subtitle="Entrena tu mente y espíritu"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-700 hidden md:block">
            Categorías Disponibles
          </h2>

          {isAdmin && (
            <Link href="/manager/training-manager">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md cursor-pointer">
                <Settings className="w-4 h-4" />
                Gestionar Entrenamiento
              </button>
            </Link>
          )}
        </div>

        {/* Banner Decorativo */}
        <div className="mb-8 p-6 rounded-2xl bg-linear-to-r from-slate-900 to-indigo-900 text-white shadow-xl relative overflow-hidden hidden md:block transition-all hover:shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">
              Tu camino al conocimiento
            </h2>
            <p className="text-indigo-200 max-w-lg">
              Completa los desafíos diarios para desbloquear nuevos niveles.
            </p>
          </div>
          <Sparkles className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 text-indigo-500/20 blur-sm animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const mastery = masteries[cat.id];

            // OBTENER ESTILOS DINÁMICOS DESDE LA DB
            const theme = getTheme(cat.color || "slate");
            const IconComponent = getIconComponent(cat.icon_key || "sparkles");

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`group relative rounded-2xl transition-all duration-300 overflow-hidden border bg-white ${theme.border} hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
              >
                <div className="p-6 pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3.5 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${theme.bgIcon} ${theme.text}`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <div className="flex flex-col items-end">
                      {mastery ? (
                        <span
                          className={`px-3 py-1 bg-linear-to-r ${theme.gradient} text-white rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider`}
                        >
                          {mastery.current_rank}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Novato
                        </span>
                      )}
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-bold text-slate-900 mb-1 transition-colors group-hover:${theme.text.replace(
                      "text-",
                      "text-"
                    )}`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed min-h-[40px]">
                    {cat.description ||
                      "Entrena tus conocimientos en este módulo."}
                  </p>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end text-xs">
                      <span className="font-semibold text-slate-600">
                        Nivel {Math.floor((mastery?.xp || 0) / 100) + 1}
                      </span>
                      <span className="text-slate-400">
                        {mastery?.xp || 0} XP
                      </span>
                    </div>

                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-linear-to-r ${theme.gradient} transition-all duration-500`}
                        style={{
                          width: `${Math.min(
                            (((mastery?.xp || 0) % 100) / 100) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="pt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                        {mastery?.games_played && mastery.games_played > 0 && (
                          <>
                            <Trophy className="w-3 h-3" />
                            <span>Top 10%</span>
                          </>
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold flex items-center gap-1 ${theme.text}`}
                      >
                        Jugar <ArrowLeft className="w-3 h-3 rotate-180" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Tarjeta de Agregar Nueva (Solo Admin) */}
          {isAdmin && (
            <Link
              href="/manager/training-manager"
              className="group relative rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer min-h-[250px]"
            >
              <div className="p-4 bg-slate-100 rounded-full mb-3 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 transition-colors">
                <Settings className="w-8 h-8" />
              </div>
              <span className="font-semibold text-slate-500 group-hover:text-indigo-600">
                Configurar Módulos
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

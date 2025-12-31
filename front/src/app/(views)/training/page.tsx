"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Leaf,
  Sparkles,
  Lock,
  Play,
  Star,
  Loader2,
} from "lucide-react";
import { Progress } from "@/shared/ui/progress";
import { TrainingGame } from "@/features/training/TrainingGame";
import { MobileHeader } from "@/shared/components/MobileHeader";

interface ICategory {
  id: number;
  name: string;
  created_at: string;
  color_class: string;
}

interface IMastery {
  id: number;
  user_id: string;
  category_id: number;
  xp: number;
  current_rank: string;
  games_played: number;
  correct_answers: number;
  updated_at: string;
}

const BRANCHES = [
  {
    name: "Biblia",
    icon: BookOpen,
    color: "bg-blue-500",
    desc: "Conocimiento de las escrituras",
  },
  {
    name: "Sabiduría",
    icon: Sparkles,
    color: "bg-purple-500",
    desc: "Sabiduría Omniversal Supina",
  },
  {
    name: "Contemplación",
    icon: BrainCircuit,
    color: "bg-indigo-500",
    desc: "Diademas y sentidos",
  },
  {
    name: "Ñekurel",
    icon: Leaf,
    color: "bg-green-500",
    desc: "Hierbas y sanación natural",
  },
  {
    name: "Inspiración",
    icon: Star,
    color: "bg-orange-500",
    desc: "El mundo de los sueños",
  },
];

export default function TrainingPage() {
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [masteries, setMasteries] = useState<Record<string, IMastery>>({});
  const [categoriesDB, setCategoriesDB] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: cats } = await supabase.from("categories").select("*");
      const typedCats = (cats as ICategory[]) || [];
      setCategoriesDB(typedCats);

      if (user) {
        const { data: userMasteries } = await supabase
          .from("user_masteries")
          .select("*")
          .eq("user_id", user.id);

        const typedMasteries = (userMasteries as IMastery[]) || [];

        // Crear un mapa rápido { "Biblia": { xp: 50, rank: 'Aprendiz'} }
        const masteryMap: Record<string, IMastery> = {};

        typedMasteries.forEach((m) => {
          const catName = typedCats.find((c) => c.id === m.category_id)?.name;
          if (catName) masteryMap[catName] = m;
        });

        setMasteries(masteryMap);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Uso de la variable loading para mostrar un estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Si hay una categoría seleccionada, mostramos el JUEGO
  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a Ramas
          </button>

          {/* COMPONENTE DE JUEGO GRANDE */}
          <TrainingGame
            category={selectedCategory}
            initialMastery={masteries[selectedCategory.name]}
          />
        </div>
      </div>
    );
  }

  // Si no, mostramos el SELECTOR DE RAMAS
  return (
    <div className="min-h-screen bg-slate-50/50">
      <MobileHeader title="Centro de Sabiduría" subtitle="aprendizaje activo" />
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANCHES.map((branch) => {
            const dbCat = categoriesDB.find((c) => c.name === branch.name);
            const mastery = masteries[branch.name];
            const isLocked = !dbCat;

            return (
              <div
                key={branch.name}
                onClick={() => !isLocked && dbCat && setSelectedCategory(dbCat)}
                className={`group relative rounded-2xl border-2 transition-all duration-300 overflow-hidden
                                ${
                                  isLocked
                                    ? "border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed"
                                    : "border-white bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer hover:border-indigo-100"
                                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl text-white shadow-md ${branch.color}`}
                    >
                      <branch.icon className="w-6 h-6" />
                    </div>
                    {mastery && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                        {mastery.current_rank}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 min-h-[40px]">
                    {branch.desc}
                  </p>

                  {isLocked ? (
                    <div className="flex items-center text-slate-400 text-sm bg-slate-100 p-2 rounded-lg justify-center gap-2">
                      <Lock className="w-4 h-4" /> Próximamente
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>XP: {mastery?.xp || 0}</span>
                        <span>Siguiente Nivel</span>
                      </div>
                      {/* Barra de Progreso Simulada */}
                      <Progress
                        value={Math.min(
                          (((mastery?.xp || 0) % 100) / 100) * 100,
                          100
                        )}
                        className="h-2"
                      />

                      <div className="pt-4 flex justify-end">
                        <span className="text-indigo-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
                          Entrar <Play className="w-4 h-4 ml-1 fill-current" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

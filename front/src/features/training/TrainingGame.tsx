"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/shared/ui/Button";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { LevelUpModal } from "@/shared/components/LevelUpModal";

interface IQuestion {
  id: number;
  category_id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
}

interface IMastery {
  current_rank: string;
  xp: number;
}

interface IRpcResponse {
  new_xp: number;
  new_rank: string;
  rank_up: boolean;
}

interface Props {
  category: { id: number; name: string };
  initialMastery: IMastery | null;
}

export const TrainingGame = ({ category, initialMastery }: Props) => {
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Estados de Progreso
  const [currentRank, setCurrentRank] = useState(
    initialMastery?.current_rank || "Aprendiz"
  );
  const [currentXP, setCurrentXP] = useState(initialMastery?.xp || 0);

  // Helper para calcular meta del siguiente nivel
  const getNextLevelThreshold = (xp: number) => {
    if (xp < 100) return 100;
    if (xp < 300) return 300;
    if (xp < 600) return 600;
    return 1000;
  };

  const nextLevelXP = getNextLevelThreshold(currentXP);
  const progressPercent = Math.min((currentXP / nextLevelXP) * 100, 100);

  // 2. Usamos useCallback para estabilizar la función y usarla en useEffect
  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);

    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("category_id", category.id)
        .limit(20);

      if (error) throw error;

      if (data && data.length > 0) {
        const randomQ = data[Math.floor(Math.random() * data.length)];
        // Casteamos a IQuestion porque Supabase devuelve tipos genéricos a veces
        setQuestion(randomQ as IQuestion);
      } else {
        setQuestion(null);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Error al cargar pregunta");
    } finally {
      setLoading(false);
    }
  }, [category.id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleAnswer = async (index: number) => {
    if (selectedOption !== null || !question) return;
    setSelectedOption(index);

    const correct = index === question.correct_index;
    setIsCorrect(correct);

    if (correct) {
      // Llamada RPC tipada
      const { data, error } = await supabase.rpc("add_mastery_xp", {
        p_category_id: category.id,
        amount: 15,
      });

      if (!error && data) {
        // Casteamos la respuesta del RPC
        const rpcData = data as IRpcResponse;

        // Actualizamos XP visualmente
        setCurrentXP(rpcData.new_xp);

        if (rpcData.rank_up) {
          setCurrentRank(rpcData.new_rank);
          setTimeout(() => setShowLevelUp(true), 1000);
        } else {
          toast.success(`+15 XP ${category.name}`, {
            position: "bottom-center",
          });
        }
      }
    } else {
      toast.error("Incorrecto", { position: "bottom-center" });
    }
  };

  if (loading && !question)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
      </div>
    );

  if (!question)
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
        <HelpCircle className="h-16 w-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">
          No hay preguntas disponibles
        </h2>
      </div>
    );

  return (
    <>
      <LevelUpModal
        open={showLevelUp}
        newRank={currentRank}
        categoryName={category.name}
        onClose={() => {
          setShowLevelUp(false);
          fetchQuestion();
        }}
      />

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 max-w-2xl mx-auto flex flex-col min-h-[600px]">
        {/* HEADER CON PROGRESO */}
        <div className="bg-indigo-600 p-6 md:p-8 text-white relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
                Quiz
              </h2>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
            <div className="text-right">
              <div className="inline-block bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-100 block mb-0.5">
                  Rango
                </span>
                <span className="font-bold text-white text-lg">
                  {currentRank}
                </span>
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="relative z-10">
            <div className="flex justify-between text-xs font-medium text-indigo-200 mb-2">
              <span>Progreso del nivel</span>
              <span>
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>
            {/* Barra personalizada */}
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                // Corregido: bg-gradient-to-r en lugar de bg-linear-to-r
                className="h-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ÁREA DE JUEGO */}
        <div className="p-6 md:p-12 flex-1 flex flex-col justify-center">
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight mb-10 text-center">
            {question.question}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {question.options.map((option: string, idx: number) => {
              let btnClass =
                "border-2 border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600";
              let icon = null;

              if (selectedOption !== null) {
                if (idx === question.correct_index) {
                  btnClass =
                    "border-green-500 bg-green-50 text-green-800 font-bold scale-[1.02] shadow-md";
                  icon = <CheckCircle className="h-6 w-6" />;
                } else if (idx === selectedOption) {
                  btnClass = "border-red-300 bg-red-50 text-red-600 opacity-50";
                  icon = <XCircle className="h-6 w-6" />;
                } else {
                  btnClass = "opacity-30 grayscale";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-5 rounded-2xl text-lg transition-all duration-300 flex justify-between items-center ${btnClass}`}
                >
                  {option}
                  {icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* FOOTER: BOTÓN SIGUIENTE */}
        {selectedOption !== null && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div
              className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${
                isCorrect ? "text-green-700" : "text-red-600"
              }`}
            >
              {question.explanation ||
                (isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta")}
            </div>
            <Button
              onClick={fetchQuestion}
              className="w-full flex items-center justify-center h-14 text-xl rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              Continuar
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

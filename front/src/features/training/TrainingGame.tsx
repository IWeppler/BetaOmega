"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/shared/ui/Button";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { LevelUpModal } from "@/shared/components/LevelUpModal";
import { getTheme, getIconComponent } from "./utils/themeConfig";
import { useGameProgression } from "./hooks/useGameProgression";

// 1. Interfaces actualizadas a la nueva estructura relacional
interface IAnswer {
  id: number;
  text: string;
  is_correct: boolean;
}

interface IQuestion {
  id: number;
  category_id: number;
  question: string;
  explanation?: string;
  difficulty?: string;
  answers: IAnswer[];
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
  category: {
    id: number;
    name: string;
    color?: string;
    icon_key?: string;
  };
  initialMastery: IMastery | null;
}

export const TrainingGame = ({ category, initialMastery }: Props) => {
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [currentRank, setCurrentRank] = useState(
    initialMastery?.current_rank || "Aprendiz"
  );
  const [currentXP, setCurrentXP] = useState(initialMastery?.xp || 0);
  const { currentLevel, nextLevel } = useGameProgression(currentXP);
  const theme = getTheme(category.color || "slate");
  const IconComponent = getIconComponent(category.icon_key || "sparkles");

  const nextLevelXP = nextLevel ? nextLevel.min_xp : currentXP * 1.5;
  const progressPercent = Math.min(
    ((currentXP - (currentLevel?.min_xp || 0)) /
      (nextLevelXP - (currentLevel?.min_xp || 0))) *
      100,
    100
  );

  const fetchQuestion = useCallback(async () => {
    if (!currentLevel) return;

    setLoading(true);
    setSelectedAnswerId(null);
    setIsCorrect(null);

    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select(`*, answers (*)`)
        .eq("category_id", category.id)
        .eq("difficulty", currentLevel.value)
        .limit(20);

      if (error) throw error;

      let selectedQ: IQuestion | null = null;

      if (data && data.length > 0) {
        selectedQ = data[Math.floor(Math.random() * data.length)] as IQuestion;
      } else {
        console.warn(
          `No hay preguntas para nivel ${currentLevel.label}, buscando generales...`
        );

        const { data: fallbackData, error: fallbackError } = await supabase
          .from("quiz_questions")
          .select(`*, answers (*)`)
          .eq("category_id", category.id)
          .limit(20);

        if (fallbackError) throw fallbackError;

        if (fallbackData && fallbackData.length > 0) {
          selectedQ = fallbackData[
            Math.floor(Math.random() * fallbackData.length)
          ] as IQuestion;
        }
      }
      if (selectedQ) {
        if (selectedQ.answers) {
          selectedQ.answers = selectedQ.answers.sort(() => Math.random() - 0.5);
        }
        setQuestion(selectedQ);
      } else {
        setQuestion(null);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Error al cargar pregunta");
    } finally {
      setLoading(false);
    }
  }, [category.id, currentLevel]);

  useEffect(() => {
    if (currentLevel) fetchQuestion();
  }, [currentLevel, fetchQuestion]);

  const handleAnswer = async (answer: IAnswer) => {
    if (selectedAnswerId !== null || !question) return;

    setSelectedAnswerId(answer.id);
    const correct = answer.is_correct;
    setIsCorrect(correct);

    if (correct) {
      const xpToGive = currentLevel?.xp_reward || 10;

      console.log("Enviando XP:", xpToGive, "Categoria:", category.id);

      const { data, error } = await supabase.rpc("add_mastery_xp", {
        p_category_id: category.id,
        amount: xpToGive,
      });

      console.log("Respuesta RPC:", data, "Error:", error);

      if (!error && data) {
        const rpcData = data as IRpcResponse;
        setCurrentXP(rpcData.new_xp);

        if (rpcData.rank_up) {
          setCurrentRank(rpcData.new_rank);
          setTimeout(() => setShowLevelUp(true), 1000);
        }
      }
    }
  };

  if (loading && !question)
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className={`animate-spin h-8 w-8 border-4 rounded-full border-t-transparent ${theme.text.replace(
            "text-",
            "border-"
          )}`}
        ></div>
      </div>
    );

  if (!question)
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
        <HelpCircle className="h-16 w-16 mx-auto text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">
          No hay preguntas disponibles
        </h2>
        <p className="text-slate-500 mt-2">
          Vuelve más tarde o contacta al administrador.
        </p>
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
        {/* HEADER CON PROGRESO Y COLOR DINÁMICO */}
        <div
          className={`${theme.gradient.replace(
            "from-",
            "bg-linear-to-r from-"
          )} p-6 md:p-8 text-white relative overflow-hidden`}
        >
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1 flex items-center gap-2">
                <IconComponent className="w-3 h-3" />
                Quiz
              </h2>
              <h1 className="text-3xl font-bold">{category.name}</h1>
            </div>
            <div className="text-right">
              <div className="inline-block bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80 block mb-0.5">
                  Rango
                </span>
                <span className="font-bold text-white text-lg">
                  {currentLevel?.label || "Cargando..."}
                </span>
              </div>
            </div>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="relative z-10">
            <div className="flex justify-between text-xs font-medium opacity-90 mb-2">
              <span>Progreso del nivel</span>
              <span>
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* ÁREA DE JUEGO */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          <h3 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight mb-10 text-center">
            {question.question}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {question.answers?.map((answer) => {
              let btnClass =
                "border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-600";
              let icon = null;

              // Lógica de estilos al responder
              if (selectedAnswerId !== null) {
                if (answer.is_correct) {
                  btnClass =
                    "border-green-500 bg-green-50 text-green-800 font-bold scale-[1.02] shadow-md";
                  icon = <CheckCircle className="h-6 w-6" />;
                } else if (answer.id === selectedAnswerId) {
                  btnClass = "border-red-300 bg-red-50 text-red-600 opacity-80";
                  icon = <XCircle className="h-6 w-6" />;
                } else {
                  btnClass = "opacity-30 grayscale border-slate-100";
                }
              }

              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswer(answer)}
                  disabled={selectedAnswerId !== null}
                  className={`w-full text-left p-5 rounded-2xl text-lg transition-all duration-300 flex justify-between items-center ${btnClass}`}
                >
                  <span className="flex-1">{answer.text}</span>
                  {icon}
                </button>
              );
            })}
          </div>
        </div>

        {/* FOOTER: BOTÓN SIGUIENTE */}
        {selectedAnswerId !== null && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div
              className={`p-3 rounded-lg mb-4 text-center font-medium ${
                isCorrect
                  ? "text-green-700 bg-green-50/50"
                  : "text-red-600 bg-red-50/50"
              }`}
            >
              {question.explanation ? (
                <>
                  <span className="block font-bold mb-1">
                    {isCorrect ? "¡Bien hecho!" : "Ups, no es esa."}
                  </span>
                  {question.explanation}
                </>
              ) : isCorrect ? (
                "¡Respuesta Correcta!"
              ) : (
                "Respuesta Incorrecta"
              )}
            </div>
            <Button
              onClick={fetchQuestion}
              className={`w-full flex items-center justify-center h-14 text-xl rounded-xl text-white shadow-lg hover:-translate-y-0.5 transition-transform ${theme.gradient.replace(
                "from-",
                "bg-linear-to-r from-"
              )}`}
            >
              Continuar
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

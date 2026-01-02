"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { QuestionFormModal } from "@/features/manager/QuestionFormModal";
import {
  getTheme,
  getIconComponent,
} from "@/features/training/utils/themeConfig";
import { MessageSquareText } from "lucide-react";

// Interfaces
export interface IAnswer {
  id?: number;
  question_id?: number;
  text: string;
  is_correct: boolean;
}

export interface IQuestion {
  id: number;
  category_id: number;
  question: string;
  difficulty: string;
  answers: IAnswer[];
  explanation?: string;
}

interface IDifficultyLevel {
  value: string;
  label: string;
  color: string;
}

interface Props {
  category: {
    id: number;
    name: string;
    color?: string;
    icon_key?: string;
  };
  initialQuestions: IQuestion[];
}

export const QuestionsManager = ({ category, initialQuestions }: Props) => {
  const [questions, setQuestions] = useState<IQuestion[]>(initialQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
    null
  );
  const [levelsMap, setLevelsMap] = useState<Record<string, IDifficultyLevel>>(
    {}
  );

  const theme = getTheme(category.color || "slate");
  const IconComponent = getIconComponent(category.icon_key || "sparkles");

  useEffect(() => {
    const fetchLevels = async () => {
      const { data } = await supabase.from("difficulty_levels").select("*");
      if (data) {
        const map: Record<string, IDifficultyLevel> = {};
        data.forEach((lvl: IDifficultyLevel) => {
          map[lvl.value] = lvl;
        });
        setLevelsMap(map);
      }
    };
    fetchLevels();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Borrar esta pregunta?")) return;

    // CAMBIO: Asegúrate que la tabla sea 'quiz_questions' si así se llama en tu DB
    const { error } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      toast.success("Pregunta eliminada");
    }
  };

  const openCreateModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const openEditModal = (q: IQuestion) => {
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleSaved = (question: IQuestion, isEdit: boolean) => {
    if (isEdit) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === question.id ? question : q))
      );
    } else {
      setQuestions((prev) => [...prev, question]);
    }
    setIsModalOpen(false);
  };

  const getBadgeStyle = (colorName: string = "slate") => {
    const styles: Record<string, string> = {
      green: "bg-green-100 text-green-700",
      yellow: "bg-yellow-100 text-yellow-700",
      red: "bg-red-100 text-red-700",
      purple: "bg-purple-100 text-purple-700",
      blue: "bg-blue-100 text-blue-700",
      orange: "bg-orange-100 text-orange-700",
      slate: "bg-slate-100 text-slate-700",
    };
    return styles[colorName] || styles["slate"];
  };

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/manager/training-manager"
              className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">Preguntas</h1>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-2 ${theme.bgIcon} ${theme.text}`}
                >
                  <IconComponent className="w-3 h-3" />
                  {category.name}
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Gestiona el contenido del quiz para este módulo
              </p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Nueva Pregunta
          </button>
        </div>

        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                No hay preguntas en el módulo{" "}
                <span className="font-semibold">{category.name}</span>.
              </p>
            </div>
          ) : (
            questions.map((q, index) => {
              const levelInfo = levelsMap[q.difficulty];
              const label = levelInfo?.label || q.difficulty;
              const color = levelInfo?.color || "slate";

              return (
                <div
                  key={q.id}
                  className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        {/* Pregunta */}
                        <h3 className="font-semibold text-slate-800 text-lg leading-snug">
                          {q.question}
                        </h3>

                        <div className="flex items-center gap-2 mt-2">
                          {/* Badge de Nivel */}
                          <span
                            className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getBadgeStyle(
                              color
                            )}`}
                          >
                            {label}
                          </span>

                          {/* Badge de Explicación */}
                          {q.explanation && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100"
                              title={q.explanation}
                            >
                              <MessageSquareText className="w-3 h-3" />
                              Con Explicación
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(q)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 ml-9">
                    {q.answers?.map((ans) => (
                      <div
                        key={ans.id}
                        className={`text-sm px-3 py-1.5 rounded border flex items-center gap-2 ${
                          ans.is_correct
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-slate-50 border-slate-100 text-slate-500"
                        }`}
                      >
                        {ans.is_correct ? (
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 shrink-0 opacity-50" />
                        )}
                        <span className="truncate">{ans.text}</span>
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="mt-3 ml-9 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100 italic">
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {isModalOpen && (
        <QuestionFormModal
          categoryId={category.id}
          question={editingQuestion}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaved}
        />
      )}
    </div>
  );
};

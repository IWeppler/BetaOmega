"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Loader2, Check, Trash2, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { IQuestion, IAnswer } from "./QuestionsManager";
import { getErrorMessage } from "@/shared/helper/getErrorMessage";

interface IDifficultyLevel {
  value: string;
  label: string;
  color: string;
}

interface Props {
  categoryId: number;
  question: IQuestion | null;
  onClose: () => void;
  onSave: (q: IQuestion, isEdit: boolean) => void;
}

export const QuestionFormModal = ({
  categoryId,
  question,
  onClose,
  onSave,
}: Props) => {
  const [text, setText] = useState(question?.question || "");
  const [difficulty, setDifficulty] = useState<string>(
    question?.difficulty || "easy"
  );
  const [explanation, setExplanation] = useState(question?.explanation || "");
  const [availableLevels, setAvailableLevels] = useState<IDifficultyLevel[]>(
    []
  );

  const [answers, setAnswers] = useState<Partial<IAnswer>[]>(
    question?.answers && question.answers.length > 0
      ? question.answers
      : [
          { text: "", is_correct: true },
          { text: "", is_correct: false },
        ]
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLevels = async () => {
      const { data } = await supabase
        .from("difficulty_levels")
        .select("*")
        .order("order", { ascending: true });

      if (data) {
        setAvailableLevels(data);
      }
    };
    fetchLevels();
  }, []);

  const handleAddOption = () => {
    if (answers.length >= 6) return toast.error("Máximo 6 opciones");
    setAnswers([...answers, { text: "", is_correct: false }]);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (answers.length <= 2) return toast.error("Mínimo 2 opciones requeridas");

    // Si borramos la correcta, avisamos o marcamos otra (opcional)
    const isDeletingCorrect = answers[indexToRemove].is_correct;

    const newAnswers = answers.filter((_, idx) => idx !== indexToRemove);

    // Si borró la correcta, dejamos todo en false para obligar al usuario a elegir una nueva
    if (isDeletingCorrect && newAnswers.length > 0) {
      toast("Has borrado la opción correcta. Por favor marca una nueva.", {
        icon: "⚠️",
      });
    }

    setAnswers(newAnswers);
  };

  const handleAnswerChange = (
    index: number,
    field: keyof IAnswer,
    value: string | boolean
  ) => {
    const newAnswers = [...answers];
    if (field === "is_correct" && value === true) {
      newAnswers.forEach((a) => (a.is_correct = false));
    }
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
  };

  const validate = () => {
    if (!text.trim()) return "La pregunta no puede estar vacía";
    if (answers.length < 2) return "Debes tener al menos 2 opciones";
    // Ahora valida solo las opciones que existen visualmente
    if (answers.some((a) => !a.text?.trim()))
      return "Todas las opciones visibles deben tener texto";
    if (!answers.some((a) => a.is_correct))
      return "Debes marcar al menos una respuesta correcta";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) return toast.error(errorMsg);

    setLoading(true);

    try {
      let questionId = question?.id;

      const questionData = {
        category_id: categoryId,
        question: text,
        difficulty,
        explanation,
      };

      if (question) {
        const { error } = await supabase
          .from("quiz_questions")
          .update(questionData)
          .eq("id", question.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("quiz_questions")
          .insert([questionData])
          .select()
          .single();
        if (error) throw error;
        questionId = data.id;
      }

      if (!questionId) throw new Error("No ID returned");

      if (question) {
        await supabase.from("answers").delete().eq("question_id", questionId);
      }

      const answersToInsert = answers.map((a) => ({
        question_id: questionId,
        text: a.text,
        is_correct: a.is_correct || false,
      }));

      const { data: savedAnswers, error: ansError } = await supabase
        .from("answers")
        .insert(answersToInsert)
        .select();

      if (ansError) throw ansError;

      const safeAnswers = (savedAnswers as IAnswer[]) || [];

      const fullQuestion: IQuestion = {
        id: questionId,
        category_id: categoryId,
        question: text,
        difficulty,
        answers: safeAnswers,
        explanation: explanation,
      };

      toast.success(question ? "Actualizado" : "Creado");
      onSave(fullQuestion, !!question);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper de estilos
  const getLevelClasses = (lvlColor: string, isSelected: boolean) => {
    const colors: Record<string, string> = {
      green: isSelected
        ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500"
        : "hover:bg-green-50",
      yellow: isSelected
        ? "bg-yellow-50 border-yellow-500 text-yellow-700 ring-1 ring-yellow-500"
        : "hover:bg-yellow-50",
      red: isSelected
        ? "bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500"
        : "hover:bg-red-50",
      purple: isSelected
        ? "bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500"
        : "hover:bg-purple-50",
      blue: isSelected
        ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
        : "hover:bg-blue-50",
    };
    const base =
      "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all";
    const specific =
      colors[lvlColor] ||
      (isSelected ? "bg-slate-100 border-slate-500" : "hover:bg-slate-50");
    const inactive = !isSelected
      ? "bg-white border-slate-200 text-slate-600"
      : "";
    return `${base} ${specific} ${inactive}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">
            {question ? "Editar Pregunta" : "Nueva Pregunta"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          <form
            id="question-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Pregunta */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Enunciado de la Pregunta
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[80px] text-lg"
                placeholder="Ej: ¿Quién construyó el arca?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
              />
            </div>

            {/* Dificultad */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Dificultad
              </label>
              {availableLevels.length === 0 ? (
                <div className="text-sm text-slate-400 italic">
                  Cargando niveles...
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {availableLevels.map((lvl) => (
                    <label
                      key={lvl.value}
                      className={getLevelClasses(
                        lvl.color,
                        difficulty === lvl.value
                      )}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        className="hidden"
                        checked={difficulty === lvl.value}
                        onChange={() => setDifficulty(lvl.value)}
                      />
                      <span className="capitalize font-medium">
                        {lvl.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4"></div>

            {/* Respuestas Dinámicas */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-700">
                  Opciones de Respuesta
                </label>
                <span className="text-xs text-slate-400">
                  Marca la correcta a la derecha
                </span>
              </div>

              <div className="space-y-3">
                {answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <input
                      type="text"
                      className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                        ${
                          ans.is_correct
                            ? "border-green-300 bg-green-50 focus:ring-green-500/50 font-medium text-green-900"
                            : "border-slate-300 focus:ring-indigo-500/50"
                        }`}
                      placeholder={`Opción ${idx + 1}`}
                      value={ans.text}
                      onChange={(e) =>
                        handleAnswerChange(idx, "text", e.target.value)
                      }
                    />

                    {/* Checkbox Correcta */}
                    <label
                      className="relative cursor-pointer w-7 h-7"
                      title="Marcar como correcta"
                    >
                      <input
                        type="checkbox"
                        className="peer appearance-none w-full h-full rounded-full border-2 border-slate-300 checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                        checked={ans.is_correct || false}
                        onChange={() =>
                          handleAnswerChange(idx, "is_correct", true)
                        }
                      />
                      <Check
                        strokeWidth={3}
                        className="absolute w-4 h-4 text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      />
                    </label>

                    {/* Botón Borrar Opción (Solo si hay más de 2) */}
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      disabled={answers.length <= 2}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none"
                      title="Eliminar opción"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Botón Agregar Opción */}
              {answers.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="mt-4 w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Agregar Opción
                </button>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4"></div>

            {/* Explicación */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Explicación (Opcional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[60px] text-sm text-slate-600"
                placeholder="Explica por qué la respuesta es correcta."
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
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
            form="question-form"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {question ? "Guardar Cambios" : "Crear Pregunta"}
          </button>
        </div>
      </div>
    </div>
  );
};

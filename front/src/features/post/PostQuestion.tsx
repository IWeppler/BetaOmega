"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import {
  MessageCircleQuestion,
  Send,
  CornerDownRight,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-hot-toast";

interface Question {
  id: number;
  question: string;
  answer: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
  } | null;
}

export const PostQuestions = ({ postId }: { postId: string }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Definimos fetchQuestions con useCallback para poder usarla en useEffect y handleSubmit
  const fetchQuestions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("post_questions")
        .select(
          `
          *,
          profiles (
            full_name
          )
        `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }

      // Casteo seguro de tipos
      setQuestions((data as unknown as Question[]) || []);
    } catch (error) {
      console.error(error);
      // Opcional: toast.error("Error al cargar preguntas");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Debes iniciar sesión para preguntar");
      setSending(false);
      return;
    }

    try {
      const { error } = await supabase.from("post_questions").insert({
        post_id: Number(postId),
        user_id: user.id,
        question: newQuestion,
        answer: null,
      });

      if (error) throw error;

      toast.success("Pregunta enviada");
      setNewQuestion("");
      fetchQuestions();
    } catch (error) {
      let message = "Error al enviar la pregunta";
      if (error instanceof Error) message = error.message;
      toast.error(message);
    } finally {
      setSending(false);
    }
  };

  const getUserName = (q: Question) => {
    return q.profiles?.full_name || "Usuario";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
      <div className="p-6 sm:p-8">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
          <MessageCircleQuestion className="h-5 w-5 text-slate-500" />
          Preguntas y Respuestas
        </h3>

        {/* Formulario */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1">
            <TextInput
              name="question"
              placeholder="Escribe una pregunta pública..."
              value={newQuestion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewQuestion(e.target.value)
              }
              className="bg-slate-50 border-slate-200 focus:bg-white transition-all"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={sending || !newQuestion.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Lista */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400 mx-auto" />
            </div>
          ) : questions.length === 0 ? (
            <p className="text-slate-400 text-sm text-center italic py-4">
              Nadie ha preguntado todavía. ¡Sé el primero!
            </p>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="text-sm space-y-2">
                <div className="flex gap-2 items-start">
                  {/* Nombre del Usuario */}
                  <div className="shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-xs bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                      {getUserName(q)}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {q.question}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {formatDistanceToNow(new Date(q.created_at), {
                        locale: es,
                      })}
                    </span>
                  </div>
                </div>

                {q.answer && (
                  <div className="flex gap-2 items-start ml-5 pl-3 border-l-2 border-slate-200 py-1">
                    <CornerDownRight className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-600 italic">{q.answer}</p>
                      <span className="text-[10px] text-slate-400">
                        Respuesta del administrador
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

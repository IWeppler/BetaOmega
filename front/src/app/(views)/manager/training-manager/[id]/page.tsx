import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { QuestionsManager } from "@/features/manager/QuestionsManager";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CategoryQuestionsPage({ params }: Props) {
  const supabase = await createClient();
  const { id: moduleId } = await params;

  // 1. Seguridad
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: moduleData } = await supabase
    .from("training_modules")
    .select("*")
    .eq("id", moduleId)
    .single();

  if (!moduleData) {
    return (
      <div className="p-8 text-center min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-slate-800">
          Módulo no encontrado
        </h2>
        <p className="text-slate-500 mb-4">
          El ID {moduleId} no existe en los entrenamientos.
        </p>
        <Link
          href="/manager/training-manager"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Volver al listado
        </Link>
      </div>
    );
  }

  // 3. Obtener Preguntas
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select(
      `
      *,
      answers (*)
    `
    )
    .eq("category_id", moduleId)
    .order("id", { ascending: true });

  // 4. Renderizar Cliente
  return (
    <QuestionsManager
      category={moduleData} // Pasamos el objeto del módulo (que tiene name, color, icon_key)
      initialQuestions={questions || []}
    />
  );
}

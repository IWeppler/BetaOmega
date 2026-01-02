import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { TrainingManager } from "@/features/manager/TrainingManager";

export default async function TrainingManagerPage() {
  const supabase = await createClient();

  // 1. Verificación de Seguridad (Middleware level is better, but this is a good double-check)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  // 2. Fetch Inicial de Datos (Categorías)
  const { data: categories } = await supabase
    .from("training_modules")
    .select("*")
    .order("id", { ascending: true });

  // 3. Renderizamos el Cliente pasándole los datos iniciales
  return <TrainingManager initialCategories={categories || []} />;
}

import { createClient } from "@/lib/supabaseServer";
import { CategoriesManagement } from "@/features/manager/CategoriesManagment";
import { ICategory, IGlossaryTerm } from "@/interfaces";
import { redirect } from "next/navigation";
import { MobileHeader } from "@/shared/components/MobileHeader";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Consultar Categorías (Para Posts)
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  // Consultar Glosario (Para Definiciones)
  const { data: terms } = await supabase
    .from("glossary_terms")
    .select("*")
    .order("term", { ascending: true });

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8f8f9]">
      <MobileHeader
        title="Gestión de Contenidos"
        subtitle="Organiza categorías y el diccionario."
      />

      <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
        <CategoriesManagement
          initialCategories={(categories as ICategory[]) || []}
          initialTerms={(terms as IGlossaryTerm[]) || []}
        />
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabaseServer";
import { CategoriesManagement } from "@/features/manager/CategoriesManagment";
import { ICategory } from "@/interfaces";
import { redirect } from "next/navigation";
import { MobileHeader } from "@/shared/components/MobileHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });

  return (
    <div className="flex-1">
      <MobileHeader
        title="Gestión de Categorías"
        subtitle="Gestiona tus categorías aquí."
      />

      <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
        <CategoriesManagement
          initialCategories={(categories as ICategory[]) || []}
        />
      </div>
    </div>
  );
}

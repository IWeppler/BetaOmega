import { createClient } from "@/lib/supabaseServer";
import { BookCreateForm } from "@/features/manager/BookCreateForm";
import { redirect } from "next/navigation";
import { MobileHeader } from "@/shared/components/MobileHeader";

export default async function CreateBookPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <>
      <MobileHeader
        title="Crear Nuevo Libro"
        subtitle="Completa los detalles para añadir un nuevo libro."
      />
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        <BookCreateForm />
      </div>
    </>
  );
}

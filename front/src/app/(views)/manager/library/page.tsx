import { createClient } from "@/lib/supabaseServer"; // Tu cliente modular
import { LibraryList } from "@/features/manager/LibraryList";
import { IBook } from "@/interfaces";
import { redirect } from "next/navigation";
import { MobileHeader } from "@/shared/components/MobileHeader";

export default async function LibraryManagerPage() {
  const supabase = await createClient();

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch de Libros (Server Side)
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    console.error("Error cargando libros:", error);
  }

  // 3. Render
  return (
    <div>
      <MobileHeader
        title="Biblioteca"
        subtitle="Crea, edita y gestiona los libros de la biblioteca"
      />

      <div className="flex-1 p-6 space-y-6">
        <LibraryList initialBooks={(books as IBook[]) || []} />
      </div>
    </div>
  );
}

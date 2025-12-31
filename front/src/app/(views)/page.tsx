import { createClient } from "@/lib/supabaseServer";
import { DashboardFeed } from "@/features/dashboard/DashboardFeed";
import { DashboardSidebar } from "@/features/dashboard/DashboardSidebar";
import { ICategory, IPost } from "@/interfaces";
import { DailySanzheiModal } from "@/features/sanzhei/DailySanzheiModal";
import { MobileHeader } from "@/shared/components/MobileHeader";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50/50">
      <DailySanzheiModal />
      <MobileHeader
        title="Muro Informativo"
        subtitle="Aqui encontraras noticias, anuncios, eventos y mucho más."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <DashboardFeed
              posts={(posts as IPost[]) || []}
              categories={(categories as ICategory[]) || []}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <DashboardSidebar currentUser={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

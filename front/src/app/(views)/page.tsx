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

  const [categoriesResponse, postsResponse] = await Promise.all([
    supabase.from("categories").select("*").order("id"),
    supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const categories = categoriesResponse.data || [];
  const posts = postsResponse.data || [];

  if (postsResponse.error) console.error("Error posts:", postsResponse.error);

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8f8f9]">
      <DailySanzheiModal />
      <MobileHeader title="Novedades" subtitle="Canal Oficial" />

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

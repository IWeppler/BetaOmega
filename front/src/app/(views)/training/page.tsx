import { createClient } from "@/lib/supabaseServer";
import {
  TrainingDashboard,
  IMastery,
} from "@/features/training/TrainingDashboard";
import { IUser } from "@/interfaces";

interface DBModule {
  id: number;
  name: string;
  created_at: string;
  description: string;
  color: string;
  icon_key: string;
}

export default async function TrainingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  const { data: modulesData } = await supabase
    .from("training_modules")
    .select("*")
    .order("id");

  const modules = ((modulesData as DBModule[]) || []).map((m) => ({
    id: m.id,
    name: m.name,
    created_at: m.created_at,
    description: m.description,
    color: m.color,
    icon_key: m.icon_key,
  }));

  // 3. Obtener Maestrías
  const masteriesMap: Record<number, IMastery> = {};

  if (user) {
    const { data: userMasteries } = await supabase
      .from("user_masteries")
      .select("*")
      .eq("user_id", user.id);

    ((userMasteries as IMastery[]) || []).forEach((m) => {
      masteriesMap[m.category_id] = m;
    });
  }

  return (
    <TrainingDashboard
      categories={modules}
      masteries={masteriesMap}
      user={user as unknown as IUser | null}
      isAdmin={isAdmin}
    />
  );
}

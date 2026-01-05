import { createClient } from "@/lib/supabaseServer";
import DashboardLayoutClient from "@/app/(views)/DashboardLayoutClient";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardLayoutClient initialUser={user}>{children}</DashboardLayoutClient>
  );
}

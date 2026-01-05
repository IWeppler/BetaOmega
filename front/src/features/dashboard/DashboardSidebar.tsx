"use client";

import { User } from "@supabase/supabase-js";
import { useAuthStore } from "@/features/auth/store/authStore";
import { LockedWrapper } from "./widgets/LockedWrapper";
import { SanzheiWidget } from "./widgets/SanzheiWidget";
import { CalendarWidget } from "./widgets/CalendarWidget";
import { SocialLinks } from "./widgets/SocialLinks";
import { StreakWidget } from "./widgets/StreakWidget";

interface SidebarProps {
  currentUser: User | null;
}

export const DashboardSidebar = ({
  currentUser: initialUser,
}: SidebarProps) => {
  const { user: storeUser } = useAuthStore();

  const activeUser = storeUser || initialUser;

  const isGuest = !activeUser;

  return (
    <div className="flex flex-col gap-6">
      {/* === ZONA PROTEGIDA (WIDGETS) === */}
      <LockedWrapper isLocked={isGuest}>
        {/* Widget 1: Sanzhei */}
        <SanzheiWidget userId={activeUser?.id} />

        {/* Widget 2: Agenda */}
        <CalendarWidget userId={activeUser?.id} />

        {/* Widget 3: Racha */}
        <StreakWidget userId={activeUser?.id} />
      </LockedWrapper>

      {/* === ZONA PÚBLICA (Redes) === */}
      <SocialLinks />

      <div className="text-center text-xs text-slate-500">
        © 2026 Beta & Omega.
      </div>
    </div>
  );
};

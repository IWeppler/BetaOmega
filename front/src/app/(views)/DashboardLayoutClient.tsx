"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { SidebarProvider } from "@/shared/ui/sidebar-context";
import { SideBar } from "@/shared/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "@supabase/supabase-js";
import { IUser } from "@/interfaces";

export default function DashboardLayoutClient({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    if (initialUser && (!user || user.id !== initialUser.id)) {
      setUser(initialUser as unknown as IUser);
    }
  }, [initialUser, user, setUser]);

  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { isSidebarCollapsed, toggleCollapse, sidebarRef, selectedModule } =
    useSidebar();

  useEffect(() => {
    if (isMobile && !isSidebarCollapsed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isSidebarCollapsed]);

  return (
    <div className={`h-screen w-full flex overflow-hidden bg-slate-50`}>
      <SideBar
        ref={sidebarRef}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleCollapse}
        selectedModule={selectedModule}
        isMobile={!!isMobile}
      />

      <main
        className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 relative`}
      >
        {children}
      </main>
    </div>
  );
};

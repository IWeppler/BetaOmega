"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
// 1. Importamos TU Provider personalizado
import { SidebarProvider } from "@/shared/ui/sidebar-context";
import { SideBar } from "@/shared/components/Sidebar";
// 2. Importamos el hook que consume ese contexto
import { useSidebar } from "@/hooks/useSidebar";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { routes } from "../routes";

const AppLoader = () => (
  <div className="flex-1 flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
  </div>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push(routes.login);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <AppLoader />;
  }

  return (
    // Aquí inicializamos el Provider
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

// === COMPONENTE HIJO (LayoutContent) ===
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

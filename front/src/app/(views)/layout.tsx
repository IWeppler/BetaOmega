"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/Store/authStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SideBar } from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { Loader2, ChevronRight } from "lucide-react";
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
  const isMobile = useIsMobile();

  const { isSidebarCollapsed, toggleCollapse, selectedModule, sidebarRef } =
    useSidebar();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push(routes.login);
    }
  }, [user, loading, router]);

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

  if (loading || !user) {
    return <AppLoader />;
  }

  return (
    <SidebarProvider>
      <div className={`min-h-screen w-full flex`}>
        {isMobile && isSidebarCollapsed && (
          <button
            onClick={toggleCollapse}
            className="fixed top-10 left-[-6px] z-50 p-[6px] rounded-full bg-neutral-950 border border-gray-300 transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 text-white " />
          </button>
        )}
        <SideBar
          ref={sidebarRef}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
          selectedModule={selectedModule}
          isMobile={isMobile}
        />
        <main className={`min-h-[75vh] flex-1 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

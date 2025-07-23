"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/Store/authStore";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SideBar} from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import {Loader2} from "lucide-react";


const AppLoader = () => (
  <div className="flex-1 flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
  </div>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuthStore();
  
  const {
    isSidebarCollapsed,
    toggleCollapse,
    selectedModule,
    sidebarRef,
  } = useSidebar();

  // Detect mobile overlay based on screen width
  const isMobileOverlay = typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <AppLoader />;
  }

  return (
    <SidebarProvider>
      <div className={`min-h-screen w-full ${isMobileOverlay ? 'relative' : 'flex'}`}>
        <SideBar
          ref={sidebarRef}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
          selectedModule={selectedModule} 
          isMobileOverlay={isMobileOverlay}
        />
        <main className={`min-h-[75vh] w-full ${isMobileOverlay ? 'blur-sm pointer-events-none' : ''}`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/Store/authStore";
import { useSidebar } from "@/hooks/useSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SideBar} from "@/components/Sidebar";

const AppLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <p className="text-xl font-gray-700">Cargando...</p>
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
      <div className="flex min-h-screen w-full">
        <SideBar
          ref={sidebarRef}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
          selectedModule={selectedModule} 
        />
        <main className="min-h-[75vh] w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}

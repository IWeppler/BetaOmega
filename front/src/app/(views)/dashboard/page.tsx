"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SideBar } from "@/components/Sidebar";
import { Content } from "./components/Content";
import { useSidebar } from "@/hooks/useSidebar";

export default function Dashboard() {
  const {
    isSidebarCollapsed,
    toggleCollapse,
    selectedModule,
    setSelectedModule,
    sidebarRef,
  } = useSidebar();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SideBar
          ref={sidebarRef}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleCollapse}
          selectedModule={selectedModule}
          onModuleSelect={setSelectedModule}
        />
        <Content slug={selectedModule?.slug || null} />
      </div>
    </SidebarProvider>
  );
}

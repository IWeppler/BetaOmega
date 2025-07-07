"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SideBar, type modules } from "../../../components/Sidebar";
import { Content } from "./components/Content";

export default function Dashboard() {
  const [selectedModule, setSelectedModule] = useState<
    (typeof modules)[0] | null
  >(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SideBar
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
          selectedModule={selectedModule}
          onModuleSelect={setSelectedModule}
        />
        <Content selectedModule={selectedModule} />
      </div>
    </SidebarProvider>
  );
}
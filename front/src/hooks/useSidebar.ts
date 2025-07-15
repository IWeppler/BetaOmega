import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "./useOutsideClick";
import { modules } from "@/app/modules/data";

export function useSidebar() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileOverlay, setIsMobileOverlay] = useState(false);
  const [selectedModule, setSelectedModule] = useState<(typeof modules)[0] | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => setSidebarCollapsed(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    setIsMobileOverlay(!isSidebarCollapsed && isMobile);
  }, [isSidebarCollapsed]);

  useOutsideClick(sidebarRef, () => {
    if (window.innerWidth < 1024 && !isSidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  });

  return {
    isSidebarCollapsed,
    isMobileOverlay,
    selectedModule,
    setSelectedModule,
    toggleCollapse,
    sidebarRef,
  };
}

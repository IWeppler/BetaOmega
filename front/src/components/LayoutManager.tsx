"use client";

import { useRef, useState, useEffect } from "react";
import { SideBar } from "@/components/Sidebar";
import ExcludedWrapper from "../components/ExcludedWrapper";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { modules } from "../app/modules/data";
import clsx from "clsx";

interface LayoutManagerProps {
  children: React.ReactNode;
  showContainer?: boolean;
}

export default function LayoutManager({
  children,
  showContainer = true,
}: LayoutManagerProps) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileOverlay, setIsMobileOverlay] = useState(false);
  const [selectedModule, setSelectedModule] = useState<
    (typeof modules)[0] | null
  >(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
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

  return (
    <>
      {isMobileOverlay && (
        <div className="fixed inset-0 bg-black opacity-50 z-30" />
      )}

      <ExcludedWrapper>
        <SideBar
          ref={sidebarRef}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)}
          selectedModule={selectedModule}
          onModuleSelect={setSelectedModule}
        />
      </ExcludedWrapper>

      <div
        className={clsx(
          "transition-all duration-300 w-full",
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
        )}
      >
        <ExcludedWrapper>
          {showContainer ? (
            <main>
              {children}
            </main>
          ) : (
            children
          )}
        </ExcludedWrapper>
      </div>
    </>
  );
}

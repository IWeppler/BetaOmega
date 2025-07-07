"use client";

import { useRef, useState, useEffect } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import SideBar from "@/components/Sidebar";
import ExcludedWrapper from "../components/ExcludedWrapper";
import { useOutsideClick } from "../hooks/useOutsideClick";
// import BreadcrumbClient from "@/components/UI/Breadcrumb";
import { modules } from "../app/modules/data"; // Asegurate de exportar aquí también

interface LayoutManagerProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
  showContainer?: boolean;
}

export default function LayoutManager({
  children,
  showBreadcrumb = true,
  showContainer = true,
}: LayoutManagerProps) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileOverlay, setIsMobileOverlay] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<(typeof modules)[0] | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setIsNavbarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 1024;
      setIsMobileOverlay(!isSidebarCollapsed && isMobile);
    }
  }, [isSidebarCollapsed]);

  useOutsideClick(sidebarRef, () => {
    if (window.innerWidth < 1024 && !isSidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  });

  useOutsideClick(navbarRef, () => {
    if (window.innerWidth < 1024 && isNavbarOpen) {
      setIsNavbarOpen(false);
    }
  });

  return (
    <>
      {isMobileOverlay && <div className="fixed inset-0 bg-black opacity-50 z-30" />}
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
        className={`transition-none duration-0 ${
          isSidebarCollapsed ? "sm:ml-16" : "sm:ml-72"
        }`}
      >
        <ExcludedWrapper>
          <div ref={navbarRef}>
            <Navbar />
          </div>
        </ExcludedWrapper>

        {showBreadcrumb || showContainer ? (
          <div className="p-4 sm:p-6 lg:p-8">
            {showBreadcrumb && (
              <div className="mb-4">
                {/* <BreadcrumbClient /> */}
              </div>
            )}

            {showContainer ? (
              <main className="bg-white rounded-lg shadow-md p-6 min-h-[75vh]">
                {children}
              </main>
            ) : (
              children
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
}

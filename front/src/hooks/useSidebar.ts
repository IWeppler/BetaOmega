import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "./useOutsideClick";
import { IBook } from "@/interfaces";
import { useBookStore } from "@/app/Store/bookStore";
import {usePathname} from "next/navigation";


export function useSidebar() {  
  const pathname = usePathname();
  const {books} = useBookStore();
  const [selectedModule, setSelectedModule] = useState<IBook | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileOverlay, setIsMobileOverlay] = useState(false);
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


  useEffect(() => {
    const match = pathname.match(/^\/dashboard\/([^\/]+)/);
    if (match) {
      const slug = match[1];
      const book = books.find((book) => book.slug === slug);
      if (book) {
        setSelectedModule(book);
      }
    }
  }, [pathname, books]);

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

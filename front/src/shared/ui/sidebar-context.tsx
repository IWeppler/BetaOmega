"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useOutsideClick } from "@/hooks/useOutsideClick"; // Asegúrate que la ruta sea correcta
import { useIsMobile } from "@/hooks/use-mobile";
import { useBookStore } from "@/app/store/bookStore";
import { IBook } from "@/interfaces";

// Definimos qué datos vamos a compartir
interface SidebarContextType {
  isSidebarCollapsed: boolean;
  toggleCollapse: () => void;
  selectedModule: IBook | null;
  setSelectedModule: (book: IBook | null) => void;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
}

// Creamos el contexto
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Creamos el Provider (Aquí va TU lógica original)
export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { books } = useBookStore();
  const [selectedModule, setSelectedModule] = useState<IBook | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const toggleCollapse = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Efecto: Cerrar/Abrir según mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  // Efecto: Detectar módulo según URL
  useEffect(() => {
    const match = pathname.match(/^\/dashboard\/([^\/]+)/);
    let foundBook: IBook | null = null;

    if (match) {
      const slug = match[1];
      foundBook = books.find((book) => book.slug === slug) || null;
    }
    setSelectedModule(foundBook);
  }, [pathname, books]);

  // Efecto: Click fuera para cerrar en mobile
  useOutsideClick(sidebarRef, () => {
    if (isMobile && !isSidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  });

  // Valores a compartir
  const value = {
    isSidebarCollapsed,
    toggleCollapse,
    selectedModule,
    setSelectedModule,
    sidebarRef,
    isMobile: !!isMobile,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

// Hook simple para CONSUMIR el contexto
export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext debe usarse dentro de un SidebarProvider"
    );
  }
  return context;
};

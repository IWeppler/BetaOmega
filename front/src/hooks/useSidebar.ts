import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "./useOutsideClick";
import { IBook } from "@/interfaces";
import { useBookStore } from "@/app/Store/bookStore";
import {usePathname} from "next/navigation";
import { useIsMobile } from "./use-mobile";

export function useSidebar() {  
  const pathname = usePathname();
  const {books} = useBookStore();
  const [selectedModule, setSelectedModule] = useState<IBook | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const toggleCollapse = () => setSidebarCollapsed(prev => !prev);

  useEffect(() => {
        if (isMobile) {
            setSidebarCollapsed(true);
        } else {
            setSidebarCollapsed(false);
        }
    }, [isMobile]);



useEffect(() => {
        const match = pathname.match(/^\/dashboard\/([^\/]+)/);
        let foundBook: IBook | null = null;

        if (match) {
            const slug = match[1];
            foundBook = books.find((book) => book.slug === slug) || null;
        }
        setSelectedModule(foundBook);
    }, [pathname, books]);

    useOutsideClick(sidebarRef, () => {
        if (isMobile && !isSidebarCollapsed) {
            setSidebarCollapsed(true);
        }
    });

  return {
        isSidebarCollapsed,
        selectedModule,
        setSelectedModule,
        toggleCollapse,
        sidebarRef,
        isMobile,
    };
}

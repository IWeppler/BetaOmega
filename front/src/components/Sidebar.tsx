"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  PlayCircle,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/app/Store/authStore";
import { useBookStore } from "@/app/Store/bookStore";
import { useProgressStore } from "@/app/Store/progressStore";
import { IBook } from "@/interfaces";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SideBarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  selectedModule: IBook | null;
  onModuleSelect: (module: IBook) => void;
}

const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
  ({ isCollapsed, toggleCollapse, selectedModule, onModuleSelect }, ref) => {
    // 2. Conectamos con todos los stores necesarios
    const { user, loading: userLoading, logOut } = useAuthStore();
    const { books, fetchAllBooks } = useBookStore();
    const { progressMap, getUserProgress } = useProgressStore();

    const [search, setSearch] = useState("");
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isWisdomDropdownOpen, setWisdomDropdownOpen] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 3. Cargamos los libros y el progreso del usuario
    useEffect(() => {
      fetchAllBooks();
      if (user?.userId) {
        getUserProgress(user.userId);
      }
    }, [fetchAllBooks, getUserProgress, user?.userId]);

    useEffect(() => {
      if (!isCollapsed) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isCollapsed]);

    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );

    if (userLoading) return <div className="p-4">Cargando...</div>;
    if (!user) return <div className="p-4 text-red-500">Error de usuario.</div>;

    // 4. Lógica para obtener el estado y el progreso de cada libro
    const getBookStatus = (bookId: string) => {
      const progress = progressMap.get(bookId);
      if (!progress || progress.progress === 0) {
        return { status: "in-progress", progress: 0, label: "Empezar" };
      }
      if (progress.progress >= 100) {
        return { status: "completed", progress: 100, label: "Completado" };
      }
      return {
        status: "in-progress",
        progress: progress.progress,
        label: "En progreso",
      };
    };

    const getStatusColor = (status: string) => {
      const colors: { [key: string]: string } = {
        completed: "bg-green-100 text-green-800",
        "in-progress": "bg-blue-100 text-blue-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusIcon = (status: string) => {
      const icons: { [key: string]: React.ReactNode } = {
        completed: <CheckCircle className="h-4 w-4" />,
        "in-progress": <PlayCircle className="h-4 w-4" />,
      };
      return icons[status] || <PlayCircle className="h-4 w-4" />;
    };

    return (
      <aside
        ref={ref}
        className={clsx(
          "relative top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-md flex flex-col transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <button
          onClick={toggleCollapse}
          className="absolute top-5 -right-3 z-50 p-1 rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-700" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          )}
        </button>

        <SidebarHeader className="border-b border-gray-200 p-4 flex items-center gap-2 justify-start">
          <Image
            src="/BYO.png"
            alt="Beta y Omega"
            width={32}
            height={32}
            className="rounded-full flex-shrink-0"
          />
          {!isCollapsed && (
            <span className="font-bold text-sm text-gray-800 truncate">
              Beta & Omega
            </span>
          )}
        </SidebarHeader>

        <div className="p-4 border-b border-gray-100">
          {isCollapsed ? (
            <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar módulo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-sm outline-none bg-gray-100 rounded-lg py-2 pl-9 pr-3"
              />
            </div>
          )}
        </div>

        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setWisdomDropdownOpen(!isWisdomDropdownOpen)}
                    className={clsx(
                      "flex items-center justify-between p-3 w-full cursor-pointer",
                      { "justify-center": isCollapsed }
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-gray-700 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-semibold text-sm">Sabiduría</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={clsx(
                          "w-4 h-4 text-gray-500 transition-transform",
                          isWisdomDropdownOpen && "rotate-180"
                        )}
                      />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {isWisdomDropdownOpen &&
                  filteredBooks.map((book, index) => {
                    // 5. Obtenemos el progreso para cada libro
                    const { status, progress, label } = getBookStatus(book.id);
                    return (
                      <SidebarMenuItem
                        key={book.id}
                        className={clsx(
                          !isCollapsed && "px-3",
                          "border-b border-gray-100 hover:bg-gray-100 last:border-b-0 cursor-pointer"
                        )}
                      >
                        <SidebarMenuButton
                          onClick={() => onModuleSelect(book)}
                          isActive={selectedModule?.id === book.id}
                          className={clsx(
                            "flex flex-col items-start p-3 h-auto w-full cursor-pointer",
                            { "items-center": isCollapsed }
                          )}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span className="h-4 w-4 text-gray-600 font-semibold text-xs flex-shrink-0 flex items-center justify-center">
                              {index + 1}
                            </span>
                            {!isCollapsed && (
                              <span className="text-sm font-medium truncate">
                                {book.title}
                              </span>
                            )}
                          </div>

                          {/* 6. Mostramos el progreso real */}
                          {!isCollapsed && (
                            <div className="w-full pl-6 space-y-2 mt-2">
                              <div className="flex justify-between text-xs">
                                <Badge
                                  variant="secondary"
                                  className={`${getStatusColor(
                                    status
                                  )} text-xs px-2 py-0.5`}
                                >
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(status)}
                                    {label}
                                  </span>
                                </Badge>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-1.5" />
                            </div>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="border-t border-gray-200 p-4 relative">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
          >
            <Image
              src="/user2.png"
              alt="Avatar de usuario"
              width={32}
              height={32}
              className="rounded-full flex-shrink-0"
            />
            {!isCollapsed && (
              <>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">Pro trial</p>
                </div>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-gray-500 transition-transform",
                    isUserDropdownOpen && "rotate-180"
                  )}
                />
              </>
            )}
          </div>

          {!isCollapsed && isUserDropdownOpen && (
            <div className="absolute bottom-full mb-2 left-4 right-4 bg-white rounded shadow-lg border border-gray-100 text-sm">
              <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50">
                <HelpCircle className="w-4 h-4" /> Soporte
              </button>
              <button
                onClick={() => logOut()}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }
);

SideBar.displayName = "SideBar";
export { SideBar };

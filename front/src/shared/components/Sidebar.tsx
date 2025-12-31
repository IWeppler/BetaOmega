"use client";

import React, { useState, useEffect, useRef, useMemo, forwardRef } from "react";
import clsx from "clsx";
import {
  Search,
  BookOpen,
  LogOut,
  Settings,
  ChevronDown,
  Lock,
  CheckCircle,
  Users,
  Library,
  Tag,
  GraduationCap,
  LayoutGrid,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Stores
import { useAuthStore } from "@/app/store/authStore";
import { useBookStore } from "@/app/store/bookStore";
import { useProgressStore } from "@/app/store/progressStore";
import { IBook, SidebarItemProps, UserRole } from "@/interfaces";
import { routes } from "@/app/routes";
import Link from "next/link";

interface SideBarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  selectedModule: IBook | null;
  isMobile: boolean;
}

export const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
  ({ isCollapsed, toggleCollapse, selectedModule, isMobile }, ref) => {
    const router = useRouter();

    const { user, loading: userLoading, logOut } = useAuthStore();
    const { books, fetchAllBooks } = useBookStore();
    const { progressMap, getUserProgress } = useProgressStore();

    const [search, setSearch] = useState("");
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isWisdomDropdownOpen, setWisdomDropdownOpen] = useState(true);
    const [isAdminDropdownOpen, setAdminDropdownOpen] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const isAdmin = user?.role === UserRole.ADMIN;

    useEffect(() => {
      fetchAllBooks();
      if (user?.id) {
        getUserProgress(user.id);
      }
    }, [fetchAllBooks, getUserProgress, user?.id]);

    const bookLockStatus = useMemo(() => {
      const lockMap = new Map<string, boolean>();
      if (isAdmin) {
        books.forEach((book) => lockMap.set(book.id, false));
        return lockMap;
      }
      books.forEach((book, index) => {
        if (index === 0) {
          lockMap.set(book.id, false);
          return;
        }
        const prevBook = books[index - 1];
        const prevBookData = progressMap.get(prevBook.id);
        const isPrevCompleted = prevBookData?.is_completed || false;
        lockMap.set(book.id, !isPrevCompleted);
      });
      return lockMap;
    }, [books, progressMap, isAdmin]);

    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );

    // Helpers UI
    const handleUserAreaClick = () => {
      if (isCollapsed) toggleCollapse();
      else setUserDropdownOpen(!isUserDropdownOpen);
    };

    const getBookStatus = (bookId: string) => {
      const progressData = progressMap.get(bookId);
      if (!progressData)
        return { status: "new", progress: 0, label: "Empezar" };
      if (progressData.is_completed)
        return { status: "completed", progress: 100, label: "Completado" };
      if (progressData.current_page > 0)
        return { status: "in-progress", progress: 50, label: "En progreso" };
      return { status: "new", progress: 0, label: "Empezar" };
    };

    const getStatusColor = (status: string) =>
      ({
        completed: "bg-green-100 text-green-800",
        "in-progress": "bg-blue-100 text-blue-800",
      }[status] || "bg-gray-100 text-gray-800");

    if (userLoading) return <div className="p-4 w-20 bg-white border-r"></div>;

    const imageUrl = user?.avatar_url
      ? `${user.avatar_url}`
      : "/default-avatar.jpg";

    return (
      <aside
        ref={ref}
        className={clsx(
          "h-screen bg-white border-r border-gray-200 relative shadow-xl flex flex-col transition-all duration-300 z-50",
          !isMobile && (isCollapsed ? "w-20 flex items-center" : "w-72"),
          isMobile &&
            (isCollapsed
              ? "w-0 overflow-hidden border-none"
              : "w-[85vw] max-w-[320px]")
        )}
      >
        {/* === HEADER DEL SIDEBAR === */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <Link href={routes.home} className="flex items-center gap-2">
              <Image
                src="/byo.png"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
            </Link>

            {!isCollapsed && (
              <span className="font-bold text-lg whitespace-nowrap text-slate-800">
                Beta & Omega
              </span>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* === CONTENIDO SCROLLEABLE === */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200">
          {/* Buscador */}
          {!isCollapsed && (
            <div className="p-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar módulo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          )}

          <div className="p-3 flex flex-col gap-2">
            {/* SECCIÓN 1: GESTIÓN (Solo Admin) */}
            {isAdmin && (
              <div className="space-y-1">
                {!isCollapsed && (
                  <button
                    onClick={() => setAdminDropdownOpen(!isAdminDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="h-3 w-3" /> Gestión
                    </span>
                    <ChevronDown
                      className={clsx(
                        "h-3 w-3 transition-transform",
                        !isAdminDropdownOpen && "-rotate-90"
                      )}
                    />
                  </button>
                )}

                {(isAdminDropdownOpen || isCollapsed) && (
                  <>
                    <SidebarItem
                      icon={<Users />}
                      label="Usuarios"
                      href="/manager/users"
                      isCollapsed={isCollapsed}
                      isActive={false}
                    />
                    <SidebarItem
                      icon={<Library />}
                      label="Libros"
                      href="/manager/library"
                      isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                      icon={<Tag />}
                      label="Categorías"
                      href="/manager/categories"
                      isCollapsed={isCollapsed}
                    />
                  </>
                )}
                {/* Separador sutil opcional */}
                <div className="my-2 border-t border-gray-100 mx-2" />
              </div>
            )}

            {/* SECCIÓN 2: HERRAMIENTAS*/}
            <div className="space-y-1">
              <SidebarItem
                icon={<GraduationCap />}
                label="Quiz"
                href="/training"
                isCollapsed={isCollapsed}
                isActive={false}
                className="bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white border-none hover:shadow-lg transition-transform"
              />
              <SidebarItem
                icon={<Calendar />}
                label="Zallampalam"
                href="/zallampalam"
                isCollapsed={isCollapsed}
                isActive={false}
                className="text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              />
            </div>

            {/* Separador entre Herramientas y Sabiduría */}
            <div className="my-1 border-t border-gray-100 mx-2" />

            {/* SECCIÓN 3: SABIDURÍA (Libros) */}
            <div className="space-y-1">
              {!isCollapsed && (
                <button
                  onClick={() => setWisdomDropdownOpen(!isWisdomDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3" /> Sabiduría
                  </span>
                  <ChevronDown
                    className={clsx(
                      "h-3 w-3 transition-transform",
                      !isWisdomDropdownOpen && "-rotate-90"
                    )}
                  />
                </button>
              )}

              {(isWisdomDropdownOpen || isCollapsed) && (
                <div className="space-y-1">
                  {filteredBooks.map((book, idx) => {
                    const isLocked = bookLockStatus.get(book.id);
                    const status = getBookStatus(book.id);
                    const isSelected = selectedModule?.id === book.id;

                    return (
                      <button
                        key={book.id}
                        onClick={() =>
                          !isLocked && router.push(`/dashboard/${book.slug}`)
                        }
                        disabled={isLocked}
                        className={clsx(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                          isSelected
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "text-slate-600 hover:bg-slate-50",
                          isLocked && "opacity-50 cursor-not-allowed grayscale"
                        )}
                      >
                        {/* ... (Contenido del botón del libro igual que antes) ... */}
                        <div className="relative shrink-0">
                          <div
                            className={clsx(
                              "h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold border transition-colors",
                              isSelected
                                ? "bg-white border-indigo-200 text-indigo-600"
                                : "bg-white border-slate-200 text-slate-500"
                            )}
                          >
                            {idx + 1}
                          </div>
                          {status.status === "completed" && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border border-white">
                              <CheckCircle className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="flex-1 text-left overflow-hidden">
                            <div className="truncate text-sm">{book.title}</div>
                            {!isLocked && (
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={clsx(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                    getStatusColor(status.status)
                                  )}
                                >
                                  {status.label}
                                </span>
                                {status.status !== "new" && (
                                  <span className="text-[10px] text-slate-400">
                                    {status.progress}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* ... */}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === FOOTER (Perfil Usuario) === */}
        <div className="border-t border-gray-200 p-3 shrink-0 bg-white z-20">
          <button
            onClick={handleUserAreaClick}
            className={clsx(
              "w-full flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-slate-50",
              isUserDropdownOpen && "bg-slate-50 ring-1 ring-slate-200"
            )}
          >
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src={imageUrl}
                alt="Avatar"
                fill
                className="rounded-full object-cover border border-slate-200"
              />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 text-left overflow-hidden">
                <div className="font-semibold text-sm text-slate-900 truncate">
                  {user?.full_name || "Usuario"}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {user?.email}
                </div>
              </div>
            )}

            {!isCollapsed && <ChevronDown className="h-4 w-4 text-slate-400" />}
          </button>

          {/* Menú desplegable Usuario */}
          {isUserDropdownOpen && !isCollapsed && (
            <div className="mt-2 space-y-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <button
                onClick={() => router.push("/profile")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Settings className="h-4 w-4" /> Mi Perfil
              </button>
              <button
                onClick={logOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-4 w-4" /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }
);

// Componente Helper para items simples
const SidebarItem = ({
  icon,
  label,
  href,
  isCollapsed,
  isActive = false,
  className = "",
}: SidebarItemProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={clsx(
        "rounded-lg transition-all group",
        isCollapsed
          ? "w-full h-12 flex items-center justify-center"
          : "w-full flex items-center gap-3 px-3 py-2.5",

        isActive
          ? "bg-slate-100 text-slate-900 font-medium"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",

        className
      )}
      title={isCollapsed ? label : undefined}
    >
      <span className={clsx("shrink-0", isActive && "text-indigo-600")}>
        {React.cloneElement(icon, {
          className: "h-5 w-5",
        } as React.HTMLAttributes<HTMLElement>)}
      </span>

      {!isCollapsed && <span className="text-sm truncate">{label}</span>}
    </button>
  );
};

SideBar.displayName = "SideBar";

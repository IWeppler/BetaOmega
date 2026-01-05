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
import Link from "next/link";

// Stores
import { useAuthStore } from "@/features/auth/store/authStore";
import { useBookStore } from "@/features/books/store/bookStore";
import { useProgressStore } from "@/features/user/store/progressStore";
import { useUIStore } from "../store/uiStore";
import { IBook, SidebarItemProps, UserRole } from "@/interfaces";
import { routes } from "@/app/routes";

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
    const { openAuthModal } = useUIStore();

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
          "h-screen bg-[#e7e2e0] border-r border-neutral-300 relative shadow-xl flex flex-col transition-all duration-300 z-50",
          !isMobile && (isCollapsed ? "w-[80px]" : "w-72"),
          isMobile &&
            (isCollapsed
              ? "w-0 overflow-hidden border-none"
              : "w-[85vw] max-w-[320px]")
        )}
      >
        {/* === HEADER DEL SIDEBAR === */}
        <div
          className={clsx(
            "h-16 flex items-center shrink-0 border-b border-neutral-300 transition-all",
            isCollapsed ? "justify-center" : "justify-between px-4"
          )}
        >
          {isCollapsed ? (
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-md hover:bg-neutral-200 transition-colors flex items-center justify-center"
              title="Expandir menú"
            >
              <div className="relative w-8 h-8">
                <Image
                  src="/byologo.png"
                  alt="Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 overflow-hidden">
                <Link href={routes.home} className="flex items-center gap-2">
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src="/byologo.png"
                      alt="Logo"
                      fill
                      sizes="32px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </Link>
                <span className="font-bold text-lg whitespace-nowrap text-neutral-800 animate-in fade-in duration-200">
                  Beta & Omega
                </span>
              </div>

              {!isMobile && (
                <button
                  onClick={toggleCollapse}
                  className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-800 transition-colors"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* === CONTENIDO SCROLLEABLE === */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 py-3">
          {/* Buscador */}
          {!isCollapsed ? (
            <div className="px-4 pb-2 mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar módulo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#fefeff] border border-[#f8f8f9] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <button
                onClick={toggleCollapse}
                className="p-2 text-neutral-500 hover:bg-neutral-200 rounded-lg transition-colors"
                title="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="px-3 flex flex-col gap-2">
            {/* SECCIÓN 1: GESTIÓN (Solo Admin) */}
            {isAdmin && (
              <div className="space-y-1">
                {!isCollapsed ? (
                  <button
                    onClick={() => setAdminDropdownOpen(!isAdminDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-600 uppercase tracking-wider hover:text-neutral-800"
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
                ) : (
                  <div className="w-full flex justify-center py-2 border-b border-neutral-300 mb-2">
                    <Lock className="h-4 w-4 text-neutral-400" />
                  </div>
                )}

                {(isAdminDropdownOpen || isCollapsed) && (
                  <div
                    className={clsx(
                      "space-y-1",
                      isCollapsed && "flex flex-col items-center"
                    )}
                  >
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
                  </div>
                )}
                {!isCollapsed && (
                  <div className="my-2 border-t border-[#d3cecd] mx-2" />
                )}
              </div>
            )}

            {/* SECCIÓN 2: HERRAMIENTAS */}
            <div
              className={clsx(
                "space-y-1",
                isCollapsed && "flex flex-col items-center mt-1"
              )}
            >
              <SidebarItem
                icon={<GraduationCap />}
                label="Quiz"
                href="/training"
                isCollapsed={isCollapsed}
                isActive={false}
                isLocked={!user}
                onClick={() => {
                  if (!user) openAuthModal("login");
                  else router.push("/training");
                }}
                className={clsx(
                  !user
                    ? "" // Estilo default bloqueado
                    : "bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:text-white border-none transition-transform hover:shadow-lg"
                )}
              />

              <SidebarItem
                icon={<Calendar />}
                label="Zallampalam"
                href="/zallampalam"
                isCollapsed={isCollapsed}
                isActive={false}
                isLocked={!user}
                onClick={() => {
                  if (!user) openAuthModal("login");
                  else router.push("/zallampalam");
                }}
              />
            </div>

            <div className="my-2 border-t border-[#d3cecd] mx-2" />

            {/* SECCIÓN 3: SABIDURÍA (Libros) */}
            <div className="space-y-1">
              {!isCollapsed ? (
                <button
                  onClick={() => setWisdomDropdownOpen(!isWisdomDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-600 uppercase tracking-wider hover:text-neutral-800"
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
              ) : (
                <div className="w-full flex justify-center py-2 mb-1">
                  <BookOpen className="h-4 w-4 text-neutral-400" />
                </div>
              )}

              {(isWisdomDropdownOpen || isCollapsed) && (
                <div
                  className={clsx(
                    "space-y-1",
                    isCollapsed && "flex flex-col items-center"
                  )}
                >
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
                        title={isCollapsed ? book.title : undefined}
                        className={clsx(
                          "transition-all group relative rounded-lg",
                          isCollapsed
                            ? "w-10 h-10 flex items-center justify-center p-0"
                            : "w-full flex items-center gap-3 px-3 py-2.5",

                          isSelected
                            ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                            : "text-neutral-600 hover:bg-neutral-50",
                          isLocked && "opacity-50 cursor-not-allowed grayscale"
                        )}
                      >
                        <div className="relative shrink-0 flex items-center justify-center">
                          <div
                            className={clsx(
                              "rounded-md flex items-center justify-center text-xs font-bold border transition-colors",
                              isCollapsed ? "h-9 w-9 text-sm" : "h-8 w-8",
                              isSelected
                                ? "bg-white border-indigo-200 text-indigo-600"
                                : "bg-white border-neutral-200 text-neutral-500"
                            )}
                          >
                            {idx + 1}
                          </div>
                          {status.status === "completed" && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border border-white z-10">
                              <CheckCircle className="h-2.5 w-2.5 text-white" />
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
                                  <span className="text-[10px] text-neutral-400">
                                    {status.progress}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {isCollapsed && isLocked && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                            Bloqueado
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === FOOTER (Perfil Usuario O Login) === */}
        <div className="border-t border-neutral-300 p-3 shrink-0 bg-[#e7e2e0] z-20">
          {user ? (
            <>
              <button
                onClick={handleUserAreaClick}
                className={clsx(
                  "w-full flex items-center rounded-xl transition-colors hover:bg-[#ededeb]",
                  isCollapsed ? "justify-center p-2" : "gap-3 p-2",
                  isUserDropdownOpen && "bg-[#ededeb] ring-1 ring-neutral-300"
                )}
                title={isCollapsed ? user.full_name : undefined}
              >
                <div className="relative h-9 w-9 shrink-0">
                  <Image
                    src={imageUrl}
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover border border-neutral-200"
                  />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-[#ededeb]"></div>
                </div>

                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="font-semibold text-sm text-neutral-900 truncate">
                        {user.full_name || "Usuario"}
                      </div>
                      <div className="text-xs text-neutral-500 truncate">
                        {user.email}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  </>
                )}
              </button>

              {isUserDropdownOpen && !isCollapsed && (
                <div className="mt-2 space-y-1 animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg"
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
            </>
          ) : (
            <></>
          )}
        </div>
      </aside>
    );
  }
);

SideBar.displayName = "SideBar";

const SidebarItem = ({
  icon,
  label,
  href,
  isCollapsed,
  isActive = false,
  className = "",
  onClick,
  isLocked = false,
}: SidebarItemProps & { onClick?: () => void; isLocked?: boolean }) => {
  const router = useRouter();

  const handleClick = () => {
    if (isLocked && onClick) {
      onClick();
      return;
    }

    if (onClick) {
      onClick();
      return;
    }

    if (href) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "rounded-lg transition-all group relative flex items-center",
        isCollapsed
          ? "w-10 h-10 justify-center p-0"
          : "w-full gap-3 px-3 py-2.5",

        !isLocked && isActive
          ? "bg-neutral-100 text-neutral-900 font-medium"
          : !isLocked &&
              "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",

        isLocked && "text-neutral-400 cursor-pointer hover:bg-neutral-50/50",

        className
      )}
      title={isCollapsed ? label : undefined}
    >
      <span
        className={clsx(
          "shrink-0 relative",
          isActive && !isLocked && "text-indigo-600"
        )}
      >
        {React.cloneElement(icon, {
          className: "h-5 w-5",
        } as React.HTMLAttributes<HTMLElement>)}
        {isLocked && isCollapsed && (
          <div className="absolute -top-1 -right-1 bg-white rounded-full p-px">
            <Lock className="w-2.5 h-2.5 text-neutral-400" />
          </div>
        )}
      </span>

      {!isCollapsed && (
        <div className="flex-1 flex items-center justify-between overflow-hidden">
          <span className="text-sm truncate">{label}</span>
          {isLocked && (
            <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-2" />
          )}
        </div>
      )}

      {isCollapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity flex items-center gap-1">
          {label} {isLocked && "(Bloqueado)"}
        </div>
      )}
    </button>
  );
};

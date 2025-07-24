"use client";

import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  HelpCircle,
  Library,
  Lock,
  LogOut,
  PlayCircle,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { useAuthStore } from "@/app/Store/authStore";
import { useBookStore } from "@/app/Store/bookStore";
import { useProgressStore } from "@/app/Store/progressStore";
import { IBook, UserRole } from "@/interfaces";
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
import { routes } from "@/app/routes";
import { useRouter } from "next/navigation";

interface SideBarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  selectedModule: IBook | null;
  isMobile: boolean;
}

const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
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

    useEffect(() => {
      if (!isCollapsed && !isMobile) {
        const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
        return () => clearTimeout(timer);
      }
    }, [isCollapsed, isMobile]);

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
        const prevBookProgress = progressMap.get(prevBook.id)?.progress || 0;
        lockMap.set(book.id, prevBookProgress < 100);
      });
      return lockMap;
    }, [books, progressMap, isAdmin]);

    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleUserAreaClick = () => {
      if (isCollapsed) {
        toggleCollapse();
      } else {
        setUserDropdownOpen(!isUserDropdownOpen);
      }
    };

    if (userLoading) return <div className="p-4">Cargando...</div>;
    if (!user) return <div className="p-4 text-red-500">Error de usuario.</div>;

    const imageUrl = user?.profile_image_url
      ? `${user.profile_image_url}`
      : "/default-avatar.jpg";

    const getBookStatus = (bookId: string) => {
      const progress = progressMap.get(bookId);
      if (!progress || progress.progress === 0)
        return { status: "new", progress: 0, label: "Empezar" };
      if (progress.progress >= 100)
        return { status: "completed", progress: 100, label: "Completado" };
      return {
        status: "in-progress",
        progress: progress.progress,
        label: "En progreso",
      };
    };
    const getStatusColor = (status: string) =>
      ({
        completed: "bg-green-100 text-green-800",
        "in-progress": "bg-blue-100 text-blue-800",
      }[status] || "bg-gray-100 text-gray-800");
    const getStatusIcon = (status: string) =>
      ({
        completed: <CheckCircle className="h-4 w-4" />,
        "in-progress": <PlayCircle className="h-4 w-4" />,
      }[status] || <PlayCircle className="h-4 w-4" />);

    return (
      <aside
        ref={ref}
        className={clsx(
          "h-screen bg-white border-r border-gray-200 relative shadow-md flex flex-col transition-all duration-300", // <<-- flex-col siempre presente

          // Desktop widths (solo aplica width cuando no es mobile)
          !isMobile && (isCollapsed ? "w-20" : "w-72"),

          // Lógica para mobile (es un fixed overlay)
          isMobile && "fixed top-0 left-0 h-screen z-50",
          isMobile &&
            (isCollapsed ? "w-0 overflow-hidden" : "w-full max-w-[320px]")
        )}
        style={
          isMobile && !isCollapsed
            ? { backgroundColor: "rgba(255, 255, 255, 0.95)" }
            : {}
        }
      >
        {/* Botón de colapso/expansión */}
        <button
          onClick={toggleCollapse}
          className={clsx(
            "absolute top-5 z-50 p-1 rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition cursor-pointer",
            isMobile ? "right-3" : "-right-3"
          )}
        >
          {isMobile ? (
            <X className="h-4 w-4 text-gray-700" />
          ) : isCollapsed ? (
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

        {/* Search Input */}
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

        {/* MAIN CONTENT AREA - DEBE TENER flex-1 y overflow-y-auto */}
        <SidebarContent className="flex-1 overflow-y-auto custom-scrollbar">
          {" "}
          {/* Asegúrate de que SidebarContent es un div y tiene flex-1 y overflow-y-auto */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Sección de Administración */}
                {isAdmin && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() =>
                          setAdminDropdownOpen(!isAdminDropdownOpen)
                        }
                        className={clsx(
                          "flex items-center justify-between p-3 w-full",
                          { "justify-center": isCollapsed }
                        )}
                      >
                        <div
                          className={clsx(
                            "flex justify-center items-center gap-2",
                            { "w-full justify-center": isCollapsed }
                          )}
                        >
                          <Shield className="h-5 w-5 text-gray-700 flex-shrink-0" />
                          {!isCollapsed && (
                            <span className="font-semibold text-sm">
                              Gestión
                            </span>
                          )}
                        </div>
                        {!isCollapsed && (
                          <ChevronDown
                            className={clsx(
                              "w-4 h-4 text-gray-500 transition-transform",
                              isAdminDropdownOpen && "rotate-180"
                            )}
                          />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {isAdminDropdownOpen && (
                      <>
                        <Link href={routes.manager.users} passHref>
                          <SidebarMenuItem
                            className={clsx(!isCollapsed && "px-3")}
                          >
                            <SidebarMenuButton className="flex items-center p-3 h-auto w-full gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                              <div
                                className={clsx("flex items-center gap-2", {
                                  "w-full justify-center": isCollapsed,
                                })}
                              >
                                <Users className="h-4 w-4 flex-shrink-0" />
                                {!isCollapsed && (
                                  <span className="text-sm">
                                    Gestionar Usuarios
                                  </span>
                                )}
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </Link>
                        <Link href={routes.manager.library} passHref>
                          <SidebarMenuItem
                            className={clsx(!isCollapsed && "px-3")}
                          >
                            <SidebarMenuButton className="flex items-center p-3 h-auto w-full gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                              <div
                                className={clsx("flex items-center gap-2", {
                                  "w-full justify-center": isCollapsed,
                                })}
                              >
                                <Library className="h-4 w-4 flex-shrink-0" />
                                {!isCollapsed && (
                                  <span className="text-sm">
                                    Gestionar Libros
                                  </span>
                                )}
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </Link>
                      </>
                    )}
                  </>
                )}
                {/* Menú de Sabiduría */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setWisdomDropdownOpen(!isWisdomDropdownOpen)}
                    className={clsx(
                      "flex items-center justify-between p-3 w-full",
                      { "justify-center": isCollapsed }
                    )}
                  >
                    <div
                      className={clsx("flex items-center gap-2", {
                        "w-full justify-center": isCollapsed,
                      })}
                    >
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
                  filteredBooks.map((book) => {
                    const isLocked = bookLockStatus.get(book.id) ?? true;
                    const { status, progress, label } = getBookStatus(book.id);
                    return (
                      <SidebarMenuItem
                        key={book.id}
                        className={clsx(
                          !isCollapsed && "px-3",
                          "border-b border-gray-100 last:border-b-0"
                        )}
                      >
                        <SidebarMenuButton
                          onClick={() => {
                            if (
                              !isLocked &&
                              selectedModule?.slug !== book.slug
                            ) {
                              router.push(`/dashboard/${book.slug}`);
                              // CERRAR SIDEBAR EN MOBILE DESPUÉS DE SELECCIONAR UN MÓDULO
                              if (isMobile && !isCollapsed) {
                                toggleCollapse();
                              }
                            }
                          }}
                          isActive={selectedModule?.slug === book.slug}
                          disabled={isLocked}
                          className={clsx(
                            "flex flex-col items-start p-3 h-auto w-full rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer",
                            { "items-center": isCollapsed },
                            isLocked && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div
                            className={clsx("flex items-center gap-2 w-full", {
                              "justify-center": isCollapsed,
                            })}
                          >
                            {isLocked ? (
                              <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            ) : (
                              <span className="h-4 w-4 text-gray-600 font-semibold text-xs flex-shrink-0 flex items-center justify-center">
                                {books.indexOf(book) + 1}
                              </span>
                            )}
                            {!isCollapsed && (
                              <span className="text-sm font-medium truncate">
                                {book.title}
                              </span>
                            )}
                          </div>
                          {!isCollapsed && !isLocked && (
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

        {/* Footer del usuario */}
        <div className="border-t border-gray-200 p-4 relative">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleUserAreaClick}
          >
            <Image
              src={imageUrl}
              alt={user.email}
              width={32}
              height={32}
              className="rounded-full flex-shrink-0"
            />
            {!isCollapsed && (
              <>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
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
              <Link href={routes.profile} passHref>
                <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
                  <User className="w-4 h-4" /> Mi Perfil
                </button>
              </Link>
              <button className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer">
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

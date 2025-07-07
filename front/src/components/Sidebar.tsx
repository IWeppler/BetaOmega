"use client";

import {
  // Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  User,
  Lock,
  PanelRight,
} from "lucide-react";
import { useAuth } from "@/app/context/authContext";
import { forwardRef } from "react";
import { modules } from "../app/modules/data"; // Asegurate de exportar los módulos en un archivo separado

interface SideBarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  selectedModule: (typeof modules)[0] | null;
  onModuleSelect: (module: (typeof modules)[0] | null) => void;
}

const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
  ({ isCollapsed, toggleCollapse, selectedModule, onModuleSelect }, ref) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-4">Cargando usuario...</div>;
    if (!user)
      return <div className="p-4 text-red-500">No se encontró el usuario.</div>;

    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "in-progress":
          return "bg-blue-100 text-blue-800";
        case "locked":
          return "bg-gray-100 text-gray-500";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed":
          return <CheckCircle className="h-4 w-4" />;
        case "in-progress":
          return <PlayCircle className="h-4 w-4" />;
        case "locked":
          return <Lock className="h-4 w-4" />;
        default:
          return <Clock className="h-4 w-4" />;
      }
    };

    const handleModuleClick = (module: (typeof modules)[0]) => {
      if (!module.locked) {
        onModuleSelect(module);
      }
    };

    return (
      <aside
        ref={ref}
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-md flex flex-col transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-72"
        }`}
      >
        {/* Header */}
        <SidebarHeader className="border-b border-gray-200 p-4 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="text-blue-600 h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {user.name}
                </h2>
                <p className="text-xs text-gray-500">Estudiante</p>
              </div>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="rounded p-1 hover:bg-gray-100 transition"
          >
            <PanelRight className="h-5 w-5 text-gray-700" />
          </button>
        </SidebarHeader>

        <SidebarContent className="overflow-y-auto">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 p-4">
                Módulos de Estudio
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {modules.map((module) => (
                  <SidebarMenuItem key={module.id}>
                    <SidebarMenuButton
                      onClick={() => handleModuleClick(module)}
                      isActive={selectedModule?.id === module.id}
                      disabled={module.locked}
                      className={`flex flex-col items-start p-3 h-auto w-full ${
                        module.locked
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      } ${isCollapsed ? "items-center" : ""}`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {module.locked ? (
                          <Lock className="h-4 w-4 text-gray-400" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-gray-700" />
                        )}
                        {!isCollapsed && (
                          <span
                            className={`text-sm font-medium truncate ${
                              module.locked ? "text-gray-400" : "text-gray-900"
                            }`}
                          >
                            {module.title}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="w-full space-y-2 mt-2">
                          <div className="flex justify-between text-xs">
                            <Badge
                              variant="secondary"
                              className={`${getStatusColor(
                                module.status
                              )} text-xs px-2 py-0.5`}
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(module.status)}
                                {module.status === "completed"
                                  ? "Completado"
                                  : module.status === "in-progress"
                                  ? "En progreso"
                                  : module.status === "locked"
                                  ? "Bloqueado"
                                  : "No iniciado"}
                              </span>
                            </Badge>
                            {!module.locked && <span>{module.progress}%</span>}
                          </div>
                          {!module.locked && (
                            <Progress
                              value={module.progress}
                              className="h-1.5"
                            />
                          )}
                          <div className="flex justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {module.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {module.chapters} cap.
                            </span>
                          </div>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </aside>
    );
  }
);

SideBar.displayName = "SideBar";
export { modules };
export { SideBar };
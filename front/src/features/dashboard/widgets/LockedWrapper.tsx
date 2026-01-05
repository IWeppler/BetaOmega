"use client";

import { useUIStore } from "@/shared/store/uiStore";
import { Lock } from "lucide-react";

interface Props {
  children: React.ReactNode;
  isLocked: boolean;
}

export const LockedWrapper = ({ children, isLocked }: Props) => {
  const { openAuthModal } = useUIStore();

  return (
    <div className="relative rounded-xl">
      {/* Contenido (con Blur si está bloqueado) */}
      <div
        className={`flex flex-col gap-6 transition-all duration-500 ${
          isLocked
            ? "filter blur-[5px] opacity-60 pointer-events-none select-none"
            : ""
        }`}
      >
        {children}
      </div>

      {/* Overlay del Candado */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl bg-white/20 backdrop-blur-[1px] transition-all duration-300">
          <button
            onClick={() => openAuthModal("login")}
            className="flex flex-col items-center gap-3 group/btn cursor-pointer transform hover:scale-105 transition-transform"
          >
            <div className="p-4 bg-slate-900 rounded-full shadow-2xl shadow-indigo-500/30 border border-slate-900 transition-all duration-300 group-hover:scale-110">
              <Lock className="h-6 w-6 text-slate-100" />
            </div>
            <div className="px-4 py-1.5 bg-slate-800 rounded-full border border-slate-900 shadow-lg backdrop-blur-md">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                Inicia Sesión para ver
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

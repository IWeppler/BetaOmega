"use client";

import { useUIStore } from "@/shared/store/uiStore";
import { Button } from "@/shared/ui/Button";
import { Lock } from "lucide-react";

interface Props {
  children: React.ReactNode;
  isLocked: boolean;
}

export const LockedWrapper = ({ children, isLocked }: Props) => {
  const { openAuthModal } = useUIStore();

  return (
    <div className="relative rounded-xl">
      {/* Contenido */}
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
            className="flex flex-col items-center gap-3 group/btn cursor-pointer"
          >
            <div className="p-4 bg-slate-900 rounded-full shadow-2xl shadow-indigo-500/30 border border-slate-900 transition-all duration-300">
              <Lock className="h-6 w-6 text-slate-100" />
            </div>
            <Button
              onClick={() => openAuthModal("login")}
              className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-white px-6 shadow-lg"
            >
              Únete para ver más
            </Button>
          </button>
        </div>
      )}
    </div>
  );
};

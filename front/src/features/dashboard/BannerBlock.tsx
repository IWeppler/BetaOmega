"use client";

import React from "react";
import { useUIStore } from "@/shared/store/uiStore";
import { Lock } from "lucide-react";
import { Button, ButtonGhost } from "@/shared/ui/Button";

// Ya no necesitamos recibir posts ni categories.
// Solo renderizamos la UI.
export const BannerBlock = () => {
  const { openAuthModal } = useUIStore();

  return (
    <div className="mt-2 relative p-8 text-center rounded-2xl bg-linear-to-b from-slate-900 to-blue-500 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Efecto Blur de fondo superior */}
      <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-slate-900/80 to-transparent z-0"></div>

      <div className="relative z-10 flex flex-col items-center gap-4 pt-4">
        <div className="p-4 bg-slate-100 rounded-full shadow-md mb-2 ring-1 ring-indigo-50">
          <Lock className="w-8 h-8 text-slate-900" />
        </div>
        <h3 className="text-2xl font-bold text-slate-100">
          ¿Te gusta lo que lees?
        </h3>
        <p className="text-slate-300 max-w-md text-sm leading-relaxed">
          Hay más publicaciones esperándote. Únete a Beta & Omega para acceder
          al historial completo y participar.
        </p>
        <div className="flex gap-4 mt-2">
          <Button
            onClick={() => openAuthModal("register")}
            className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-white px-6 shadow-lg"
          >
            Crear cuenta gratis
          </Button>
          <ButtonGhost onClick={() => openAuthModal("login")}>
            Iniciar sesión
          </ButtonGhost>
        </div>
      </div>
    </div>
  );
};

export default BannerBlock;

"use client";

import React from "react";
import { useUIStore } from "@/shared/store/uiStore";
import { Lock } from "lucide-react";
import { Button, ButtonGhost } from "@/shared/ui/Button";

export const BannerBlock = () => {
  const { openAuthModal } = useUIStore();

  return (
    <div
      className="mt-2 relative p-8 text-center rounded-2xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{
        background: "linear-gradient(to bottom, #e6e9b8, #9beef8)",
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-4 pt-4">
        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md mb-2 ring-1 ring-white/50">
          <Lock className="w-8 h-8 text-slate-800" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900">
          ¿Te gusta lo que lees?
        </h3>

        <p className="text-slate-700 max-w-md text-sm leading-relaxed font-medium">
          Hay más publicaciones esperándote. Únete a Beta & Omega para acceder
          al historial completo y participar.
        </p>

        <div className="flex gap-4 mt-2">
          <Button
            onClick={() => openAuthModal("register")}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 shadow-lg border-none"
          >
            Crear cuenta gratis
          </Button>

          <ButtonGhost
            onClick={() => openAuthModal("login")}
            className="text-slate-800"
          >
            Iniciar sesión
          </ButtonGhost>
        </div>
      </div>
    </div>
  );
};

export default BannerBlock;

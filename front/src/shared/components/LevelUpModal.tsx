"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/Button";
import confetti from "canvas-confetti";
import { Trophy } from "lucide-react";

interface Props {
  open: boolean;
  newRank: string;
  categoryName: string;
  onClose: () => void;
}

export const LevelUpModal = ({
  open,
  newRank,
  categoryName,
  onClose,
}: Props) => {
  useEffect(() => {
    if (open) {
      // Disparar confeti al abrir
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#6366f1", "#a855f7", "#fbbf24"],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#6366f1", "#a855f7", "#fbbf24"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        /* Bloqueamos cierre manual para forzar botón */
      }}
    >
      <DialogContent className="sm:max-w-md border-none bg-transparent shadow-none p-0 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-yellow-400 relative overflow-hidden max-w-sm w-full animate-in zoom-in-50 duration-500">
          {/* Rayos de fondo decorativos */}
          <div className="absolute inset-0 bg-yellow-50/50 z-0"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 p-6 rounded-full bg-yellow-100 border-4 border-yellow-200 shadow-inner">
              <Trophy className="h-16 w-16 text-yellow-600 drop-shadow-sm" />
            </div>

            <DialogTitle className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">Felicidades!</DialogTitle>

            <p className="text-slate-500 font-medium mb-6">
              Has alcanzado un nuevo nivel de conocimiento en{" "}
              <strong className="text-indigo-600">{categoryName}</strong>
            </p>

            <div className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xl mb-8 shadow-lg transform -rotate-2">
              {newRank}
            </div>

            <Button
              onClick={onClose}
              className="w-full flex items-center justify-center bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold h-12 text-lg rounded-xl shadow-lg transition-transform"
            >
              Continuar Entrenando
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

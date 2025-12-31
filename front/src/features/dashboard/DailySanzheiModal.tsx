"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/Button";
import { Sparkles } from "lucide-react";
import { useSanzheiStore } from "@/features/sanzhei/store/sanzheiStore";

export const DailySanzheiModal = () => {
  const { sanzhei, hasSeenToday, markAsSeen, isLoading } = useSanzheiStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && sanzhei && !hasSeenToday) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, sanzhei, hasSeenToday]);

  const handleClose = () => {
    markAsSeen();
    setOpen(false);
  };

  if (!sanzhei) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md text-center border-none shadow-2xl bg-linear-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex justify-center mb-2 mt-4">
          <div className="p-3 rounded-full bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Sparkles className="h-8 w-8 text-indigo-400" />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-center text-xl font-light tracking-widest text-indigo-200 uppercase">
            Consejo del Día
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 px-2">
          <p className="text-lg leading-relaxed text-slate-100">
            &quot;{sanzhei.content}&quot;
          </p>
          <p className="mt-4 text-sm text-indigo-300">— Sanzhei {sanzhei.id}</p>
        </div>

        <div className="flex justify-center pb-4">
          <Button
            onClick={handleClose}
            className="bg-white text-slate-900 hover:bg-slate-200 font-semibold px-8"
          >
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

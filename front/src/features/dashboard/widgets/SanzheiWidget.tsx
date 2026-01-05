"use client";

import { useEffect } from "react";
import { Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useSanzheiStore } from "@/features/sanzhei/store/sanzheiStore";

interface Props {
  userId?: string;
}

export const SanzheiWidget = ({ userId }: Props) => {
  const { sanzhei, isLoading, fetchDailySanzhei } = useSanzheiStore();

  useEffect(() => {
    fetchDailySanzhei(userId);
  }, [fetchDailySanzhei, userId]);

  return (
    <Card className="hidden md:block border-none shadow-md bg-slate-900 text-white overflow-hidden relative min-h-[140px]">
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center gap-2 text-indigo-200">
          <Quote className="h-4 w-4" />
          <CardTitle className="text-xs font-bold uppercase tracking-wider">
            Sanzhei del día
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pb-4">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        ) : sanzhei ? (
          <>
            <p className="text-sm font-medium leading-relaxed italic opacity-90">
              &ldquo;{sanzhei.content}&quot;
            </p>
            <p className="text-xs text-indigo-300 mt-2 font-semibold text-right">
              — Sanzhei {sanzhei.id}
            </p>
          </>
        ) : (
          <p className="text-sm opacity-50">No hay consejo hoy.</p>
        )}
      </CardContent>
    </Card>
  );
};
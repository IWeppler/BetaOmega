"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Flame } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";

// 1. Definimos la interfaz de las props
interface StreakWidgetProps {
  userId?: string; // Es opcional (?) por si el usuario no está logueado
}

// 2. Recibimos la prop en el componente
export const StreakWidget = ({ userId }: StreakWidgetProps) => {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getStreak(userId);
    } else {
      setStreak(0); 
    }
  }, [userId]);

  const getStreak = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", uid)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching streak:", error);
      }

      if (data) {
        setStreak(data.current_streak || 0);
      }
    } finally {
      setLoading(false);
    }
  };

  const getMotivation = (days: number) => {
    if (days === 0) return "Hoy es un buen día para empezar.";
    if (days === 1) return "Primer paso completado.";
    if (days < 3) return "Estás creando el hábito.";
    if (days < 7) return "Tu constancia da frutos.";
    if (days < 30) return "Lo estás haciendo muy bien. Seguí así.";
    return "Tu disciplina es consistente y sólida. ¡Felicidades!";
  };

  // Si no hay usuario, no mostramos el widget (o podrías mostrar un placeholder)
  if (!userId) return null;

  if (loading) {
    return (
      <Card className="border-none shadow-sm bg-slate-50 animate-pulse h-[80px]" />
    );
  }

  return (
    <Card
      className={`border-none shadow-sm overflow-hidden transition-all ${
        streak > 0 ? "bg-orange-50" : "bg-slate-50"
      }`}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Constancia
          </span>
          <span
            className={`text-sm font-medium ${
              streak > 0 ? "text-orange-700" : "text-slate-600"
            }`}
          >
            {getMotivation(streak)}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
          <Flame
            className={`h-5 w-5 ${
              streak > 0
                ? "text-orange-500 fill-orange-500 animate-pulse"
                : "text-slate-300"
            }`}
          />
          <span
            className={`text-lg font-bold ${
              streak > 0 ? "text-orange-600" : "text-slate-400"
            }`}
          >
            {streak}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

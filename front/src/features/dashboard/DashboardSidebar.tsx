// front/src/features/dashboard/DashboardSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { User } from "@supabase/supabase-js"; // Importamos el tipo User
import {
  Youtube,
  Instagram,
  MessageCircle,
  Facebook,
  Clock,
  Bell,
  BellRing,
  Quote,
  CalendarDays,
  ArrowRight,
  LucideIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ButtonGhost } from "@/shared/ui/Button";
import { toast } from "react-hot-toast";
import { useSanzheiStore } from "../sanzhei/store/sanzheiStore";
import { StreakWidget } from "./StreakWidget";

interface DashboardEvent {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
}

// Props: Recibimos el usuario (puede ser null)
interface SidebarProps {
  currentUser: User | null;
}

export const DashboardSidebar = ({ currentUser }: SidebarProps) => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  const {
    sanzhei,
    isLoading: loadingSanzhei,
    fetchDailySanzhei,
  } = useSanzheiStore();

  useEffect(() => {
    fetchDailySanzhei(currentUser?.id);

    fetchUpcomingEvents();
  }, [fetchDailySanzhei, currentUser]);

  const fetchUpcomingEvents = async () => {
    try {
      const today = new Date().toISOString();
      const { data, error } = await supabase
        .from("calendar_events")
        .select("id, title, date, location")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(4);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error cargando agenda:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const toggleNotification = async (id: number, title: string) => {
    // 1. Validación de Usuario Real
    if (!currentUser) {
      toast.error("Debes iniciar sesión para activar recordatorios", {
        icon: "🔒",
      });
      return;
    }

    // Lógica UI (Optimista)
    if (notifiedEvents.includes(id)) {
      setNotifiedEvents((prev) => prev.filter((eventId) => eventId !== id));
      toast.success("Recordatorio desactivado");
      // TODO: Llamada a Supabase para borrar de 'event_notifications'
    } else {
      setNotifiedEvents((prev) => [...prev, id]);
      toast.success(`Te avisaremos antes de: ${title}`);
      // TODO: Llamada a Supabase para insertar en 'event_notifications' usando currentUser.id
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. WIDGET: Daily Sanzhei (Sin cambios) */}
      <Card className="hidden md:block border-none shadow-md bg-slate-900 text-white overflow-hidden relative min-h-[140px]">
        {/* ... (Contenido igual que antes) ... */}
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center gap-2 text-indigo-200">
            <Quote className="h-4 w-4" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider">
              Sanzhei del día
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pb-4">
          {loadingSanzhei ? (
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

      {/* 2. WIDGET: Agenda (Zallampalam) */}
      <Card className="hidden md:block border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="pb-2 border-b border-slate-50 pt-4">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Zallampalam
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {loadingEvents ? (
              <div className="p-4 space-y-3">
                {/* Skeleton igual que antes */}
              </div>
            ) : events.length > 0 ? (
              events.map((event) => {
                const eventDate = new Date(event.date);
                const dayNumber = format(eventDate, "d");
                const monthName = format(eventDate, "MMM", { locale: es })
                  .toUpperCase()
                  .replace(".", "");
                const timeString = format(eventDate, "HH:mm") + " hs";
                const isNotified = notifiedEvents.includes(event.id);

                return (
                  <div
                    key={event.id}
                    className="p-3 flex items-center gap-3 hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* ... (Renderizado de fecha y titulo igual que antes) ... */}
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                      <span className="text-[9px] font-bold uppercase text-slate-500 leading-none mb-0.5 group-hover:text-indigo-500">
                        {monthName}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 leading-none group-hover:text-indigo-700">
                        {dayNumber}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold text-slate-800 truncate"
                        title={event.title}
                      >
                        {event.title}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{timeString}</span>
                      </div>
                    </div>

                    {/* Botón Campana actualizado */}
                    <button
                      onClick={() => toggleNotification(event.id, event.title)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isNotified
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-slate-300 hover:text-slate-500"
                      }`}
                      title={
                        !currentUser
                          ? "Inicia sesión para activar"
                          : "Recordarme"
                      }
                    >
                      {isNotified ? (
                        <BellRing className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-slate-400">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-xs">No hay eventos próximos.</p>
              </div>
            )}
          </div>

          <div className="p-2 border-t border-slate-50 text-center">
            <ButtonGhost className="w-full text-sm flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
              <Link href="/zallampalam" className="flex items-center gap-2">
                <span>Ver calendario</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </ButtonGhost>
          </div>
        </CardContent>
      </Card>

      {/* 3. WIDGET: Racha (Streak) */}
      <StreakWidget userId={currentUser?.id} />

      {!currentUser && (
        <div className="text-center p-3 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <p className="text-xs text-slate-500 mb-2">
            Inicia sesión para ver tu progreso
          </p>
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Ir al Login
          </Link>
        </div>
      )}

      {/* 4. REDES SOCIALES (Mismo componente SocialIcon abajo...) */}
      <div className="flex items-center justify-center gap-4 py-2 opacity-80 hover:opacity-100 transition-opacity">
        {/* ... Tus iconos sociales ... */}
        <SocialIcon
          href="https://instagram.com/alenyemin"
          icon={Instagram}
          color="text-pink-600"
        />
        <SocialIcon
          href="https://www.youtube.com/@sabiduriaomniversalsupina"
          icon={Youtube}
          color="text-red-600"
        />
        <SocialIcon
          href="https://whatsapp.com/"
          icon={MessageCircle}
          color="text-green-600"
        />
        <SocialIcon
          href="https://www.facebook.com/profile.php?id=61579209137758&locale=es_LA"
          icon={Facebook}
          color="text-blue-600"
        />
      </div>

      <div className="text-center text-xs text-slate-500">
        © 2026 Beta & Omega.
      </div>
    </div>
  );
};

const SocialIcon = ({
  href,
  icon: Icon,
  color,
}: {
  href: string;
  icon: LucideIcon;
  color: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`p-2 bg-white rounded-full shadow-sm border border-slate-100 transition-transform hover:scale-110 ${color}`}
  >
    <Icon className="h-4 w-4" />
  </a>
);

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Clock,
  Bell,
  BellRing,
  CalendarDays,
  ArrowRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ButtonGhost } from "@/shared/ui/Button";
import { toast } from "react-hot-toast";

interface DashboardEvent {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
}

interface Props {
  userId?: string;
}

export const CalendarWidget = ({ userId }: Props) => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifiedEvents, setNotifiedEvents] = useState<number[]>([]);

  useEffect(() => {
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
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const toggleNotification = (id: number, title: string) => {
    // Si está bloqueado, el click no llegará aquí gracias al LockedWrapper,
    // pero por seguridad chequeamos userId.
    if (!userId) return;

    if (notifiedEvents.includes(id)) {
      setNotifiedEvents((prev) => prev.filter((eventId) => eventId !== id));
      toast.success("Recordatorio desactivado");
    } else {
      setNotifiedEvents((prev) => [...prev, id]);
      toast.success(`Te avisaremos antes de: ${title}`);
    }
  };

  return (
    <Card className="hidden md:block border-slate-100 shadow-sm overflow-hidden bg-white">
      <CardHeader className="pb-2 border-b border-slate-50 pt-4">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Zallampalam
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="p-4 space-y-3 animate-pulse">
               <div className="h-8 bg-slate-100 rounded w-full"></div>
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
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                    <span className="text-[9px] font-bold uppercase text-slate-500 leading-none mb-0.5 group-hover:text-slate-700">
                      {monthName}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 leading-none group-hover:text-slate-700">
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

                  <button
                    onClick={() => toggleNotification(event.id, event.title)}
                    className={`p-1.5 rounded-full transition-colors ${
                      isNotified
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-300 hover:text-slate-500"
                    }`}
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
  );
};
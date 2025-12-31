"use client";

import { useState } from "react";
import Link from "next/link";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sun,
  Heart,
  Leaf,
  Moon,
  User,
  Coffee,
  LucideIcon,
  ExternalLink,
} from "lucide-react";
import { ButtonGhost } from "@/shared/ui/Button";

// 1. Definimos la interfaz para el Tema
interface ITheme {
  name: string;
  color: string;
  dot: string;
  icon: LucideIcon;
  desc: string;
}

// 2. Aplicamos el tipo Record<number, ITheme>
const THEMES: Record<number, ITheme> = {
  0: {
    name: "Espíritu",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    icon: Sun,
    desc: "Domingo de celebración.",
  },
  1: {
    name: "Vida",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    icon: Heart,
    desc: "Lunes de vitalidad.",
  },
  2: {
    name: "Naturaleza",
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    icon: Leaf,
    desc: "Martes de conexión.",
  },
  3: {
    name: "Energía",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
    icon: Sun,
    desc: "Miércoles de potencia.",
  },
  4: {
    name: "Sabiduría",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    icon: Moon,
    desc: "Jueves de estudio.",
  },
  5: {
    name: "Humano",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: User,
    desc: "Viernes de comunidad.",
  },
  6: {
    name: "Descanso",
    color: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    icon: Coffee,
    desc: "Sábado de reposo.",
  },
};

interface Event {
  id: number;
  date: Date;
  title: string;
  time: string;
  location: string;
  type: string;
  post_id?: number;
}

interface Props {
  events: Event[];
}

export const CalendarAlmanac = ({ events }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Lógica de fechas
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Navegación
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Datos derivados
  const selectedTheme = THEMES[getDay(selectedDate)];
  const selectedEvents = events.filter((ev) =>
    isSameDay(ev.date, selectedDate)
  );

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        {/* Título y Navegación */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <h2 className="text-lg md:text-2xl font-bold text-slate-900 capitalize flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-slate-500" />
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
          <div className="flex gap-1">
            <ButtonGhost onClick={prevMonth} className="p-2">
              <ChevronLeft className="w-5 h-5" />
            </ButtonGhost>
            <ButtonGhost onClick={goToToday} className="text-xs font-bold">
              HOY
            </ButtonGhost>
            <ButtonGhost onClick={nextMonth} className="p-2">
              <ChevronRight className="w-5 h-5" />
            </ButtonGhost>
          </div>
        </div>

        {/* NOTA: Ya no necesitamos el botón "Nuevo Evento" aquí si lo unificamos con Posts,
            pero si quisieras dejarlo, aquí iría el {isAdmin && ...} */}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* CALENDARIO */}
        <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
              <div
                key={d}
                className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((day) => {
              const dayTheme = THEMES[getDay(day)];
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDay = isToday(day);
              const dayEvents = events.filter((ev) => isSameDay(ev.date, day));
              const hasEvents = dayEvents.length > 0;

              return (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    relative min-h-[60px] md:min-h-[100px] border-b border-r border-slate-100 p-1 sm:p-2 cursor-pointer transition-all
                    ${
                      !isCurrentMonth
                        ? "bg-slate-50/50 text-slate-300"
                        : "bg-white"
                    }
                    ${
                      isSelected
                        ? "ring-2 ring-inset ring-indigo-500 bg-indigo-50/30 z-10"
                        : "hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                        isTodayDay
                          ? "bg-slate-900 text-white"
                          : "text-slate-700"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {isCurrentMonth && (
                      <div
                        className={`w-2 h-2 rounded-full ${dayTheme.dot}`}
                        title={dayTheme.name}
                      />
                    )}
                  </div>

                  <div className="hidden md:block mt-1 space-y-1">
                    {dayEvents.map((ev, i) => (
                      <div
                        key={i}
                        className="text-[10px] truncate bg-slate-100 rounded px-1 text-slate-600 border border-slate-200"
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                  <div className="md:hidden flex justify-center mt-1">
                    {hasEvents && (
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETALLE LATERAL */}
        <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-6 animate-in slide-in-from-bottom-5 duration-500">
          <div
            className={`rounded-2xl border-2 overflow-hidden shadow-sm ${selectedTheme.color}`}
          >
            <div className="p-6 flex flex-col gap-6 items-center">
              <div className="flex flex-col items-center text-center w-full">
                <div className="text-4xl font-black mb-1">
                  {format(selectedDate, "d")}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest mb-4 opacity-80">
                  {format(selectedDate, "MMMM", { locale: es })}
                </div>
                <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl w-full flex flex-col items-center border border-white/50 shadow-sm">
                  <selectedTheme.icon className="w-8 h-8 mb-2 opacity-80" />
                  <span className="font-bold text-lg">
                    {selectedTheme.name}
                  </span>
                  <p className="text-xs opacity-70 mt-1">
                    {selectedTheme.desc}
                  </p>
                </div>
              </div>

              <div className="w-full bg-white/60 backdrop-blur-md rounded-xl p-5 border border-white/50 min-h-[160px]">
                <h3 className="text-sm font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Agenda del día
                </h3>

                {selectedEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEvents.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 pb-3 border-b border-slate-200/50 last:border-0 last:pb-0"
                      >
                        {/* Hora */}
                        <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shrink-0">
                          {ev.time}
                        </div>

                        {/* Info y Botón */}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 text-sm truncate">
                            {ev.title}
                          </p>

                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3 h-3" /> {ev.location}
                            </div>

                            {/* Enlace al Post vinculado */}
                            {ev.post_id && (
                              <Link
                                href={`/dashboard?highlight=${ev.post_id}`}
                                className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                              >
                                Ver detalle <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic py-4">
                    <p>No hay eventos programados.</p>
                    <span className="text-xs opacity-70 mt-1">
                      ¡Disfruta del día!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

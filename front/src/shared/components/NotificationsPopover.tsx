"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Bell,
  Check,
  Info,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "event";
  is_read: boolean;
  created_at: string;
  link?: string;
}

export const NotificationsPopover = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar notificaciones
  const fetchNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10); // Traemos las últimas 10

    if (data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    }
  };

  useEffect(() => {
    // 1. Carga inicial
    fetchNotifications();

    // 2. Suscripción a cambios en vivo
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications();

          toast("Nueva notificación recibida", { icon: "🔔" });
        }
      )

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: number, link?: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    if (link) {
      setIsOpen(false);
      router.push(link);
    }
  };

  const markAllRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  };

  // Icono según tipo
  const getIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 shadow-xl border-slate-200"
        align="end"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <h4 className="font-semibold text-sm text-slate-800">
            Notificaciones
          </h4>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Marcar leídas
            </button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id, notification.link)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-slate-50 transition-colors flex gap-3 items-start",
                    !notification.is_read && "bg-indigo-50/30"
                  )}
                >
                  <div className="mt-1 shrink-0 bg-white p-1.5 rounded-full shadow-sm border border-slate-100">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={cn(
                        "text-sm text-slate-800 leading-none",
                        !notification.is_read && "font-bold"
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

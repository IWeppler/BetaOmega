"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button, ButtonGhost } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { TiptapEditor } from "@/shared/ui/TipTapEditor";

import {
  PenSquare,
  Loader2,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
} from "lucide-react";
import { createPost, updatePost } from "@/features/post/services/post.service";
import { toast } from "react-hot-toast";
import { ICategory } from "@/interfaces";

// Definimos una interfaz básica para el post que vamos a editar
interface PostToEdit {
  id: number;
  title: string;
  content: string;
  category_id: number;
  is_pinned?: boolean;
}

interface PostFormModalProps {
  categories: ICategory[];
  postToEdit?: PostToEdit | null; // Opcional: si viene, es modo Edición
  trigger?: React.ReactNode; // Botón personalizado para abrir
  onSuccess?: () => void; // Callback para recargar la lista externa
}

export const PostFormModal = ({
  categories,
  postToEdit,
  trigger,
  onSuccess,
}: PostFormModalProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);

  // Estados
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Estados Evento
  const [hasEvent, setHasEvent] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState("20:00");
  const [eventLocation, setEventLocation] = useState("");

  const isEditing = !!postToEdit;

  // --- EFECTO: Cargar datos al abrir en modo Edición ---
  useEffect(() => {
    if (open && postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setCategoryId(String(postToEdit.category_id));

      // Buscar si tiene evento asociado
      setFetchingEvent(true);
      const fetchEvent = async () => {
        const { data } = await supabase
          .from("calendar_events")
          .select("*")
          .eq("post_id", postToEdit.id)
          .single();

        if (data) {
          setHasEvent(true);
          const dateObj = new Date(data.date);
          setEventDate(dateObj);
          setEventTime(format(dateObj, "HH:mm"));
          setEventLocation(data.location || "");
        } else {
          setHasEvent(false);
          setEventDate(undefined);
          setEventTime("20:00");
          setEventLocation("");
        }
        setFetchingEvent(false);
      };
      fetchEvent();
    } else if (open && !postToEdit) {
      // Modo crear: limpiar
      resetForm();
    }
  }, [open, postToEdit]);

  const timeOptions = useMemo(() => {
    const options: string[] = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0");
      options.push(`${hour}:00`);
      options.push(`${hour}:30`);
    }
    return options;
  }, []);

  const getEventTypeFromCategory = (catId: string): string => {
    const category = categories.find((c) => String(c.id) === catId);
    if (!category) return "info";
    const colorClass = category.color_class || "";
    if (colorClass.includes("red")) return "important";
    if (colorClass.includes("green")) return "success";
    if (colorClass.includes("orange")) return "warning";
    if (colorClass.includes("yellow")) return "warning";
    return "info";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    if (hasEvent && (!eventDate || !eventLocation)) {
      toast.error("Faltan datos del evento");
      return;
    }

    setLoading(true);

    let eventPayload = null;
    if (hasEvent && eventDate) {
      const [hours, minutes] = eventTime.split(":").map(Number);
      const dateTime = new Date(eventDate);
      dateTime.setHours(hours);
      dateTime.setMinutes(minutes);

      eventPayload = {
        date: dateTime.toISOString(),
        location: eventLocation,
        type: getEventTypeFromCategory(categoryId),
      };
    }

    const payload = {
      title,
      content,
      category_id: Number(categoryId),
      is_pinned: false, // O podrías mantener el valor original si editas
      event: eventPayload,
    };

    let result;
    if (isEditing && postToEdit) {
      result = await updatePost(postToEdit.id, payload);
    } else {
      result = await createPost(payload);
    }

    setLoading(false);

    if (result.success) {
      toast.success(
        isEditing ? "Publicación actualizada" : "Publicación creada"
      );
      setOpen(false);
      if (!isEditing) resetForm();

      if (onSuccess) onSuccess(); // Callback personalizado
      router.refresh(); // Refresco general
    } else {
      toast.error(result.error || "Error al guardar");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategoryId("");
    setHasEvent(false);
    setEventDate(undefined);
    setEventTime("20:00");
    setEventLocation("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="bg-slate-900 hover:bg-slate-800 text-white h-full shrink-0 p-3 flex items-center justify-center gap-0 md:gap-2 transition-all">
            <Plus className="h-6 w-6 md:hidden" />
            <PenSquare className="hidden md:block h-4 w-4" />
            <span className="hidden md:inline ml-2">Nueva Publicación</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Publicación" : "Crear Publicación"}
          </DialogTitle>
        </DialogHeader>

        {fetchingEvent ? (
          <div className="h-40 flex items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Categoría */}
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select onValueChange={setCategoryId} value={categoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${cat.color_class
                            .split(" ")[0]
                            .replace("bg-", "bg-")}`}
                        ></span>
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <TextInput
                name="title"
                label="Título"
                placeholder="Ej: Reunión en Tucumán"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
              />
            </div>

            {/* Editor */}
            <div className="space-y-2">
              <Label>Contenido</Label>
              <TiptapEditor
                content={content}
                onChange={(newContent) => setContent(newContent)}
                placeholder="Escribe aquí..."
              />
            </div>

            {/* EVENTO VINCULADO */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700">
                  <CalendarIcon className="w-4 h-4 text-indigo-600" />
                  <Label
                    htmlFor="event-mode"
                    className="cursor-pointer font-semibold"
                  >
                    {hasEvent ? "Evento Vinculado" : "Vincular Evento"}
                  </Label>
                </div>
                <Switch
                  id="event-mode"
                  checked={hasEvent}
                  onCheckedChange={setHasEvent}
                />
              </div>

              {hasEvent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-300 pt-2 border-t border-slate-200/60">
                  <div className="space-y-1.5 flex flex-col">
                    <Label className="text-xs text-slate-500 font-medium">
                      Fecha
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <ButtonGhost
                          className={cn(
                            "w-full pl-3 flex items-center text-left font-normal border-slate-200 bg-white shadow-sm h-9",
                            !eventDate && "text-slate-500"
                          )}
                        >
                          {eventDate ? (
                            format(eventDate, "P", { locale: es })
                          ) : (
                            <span>Elegir fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                        </ButtonGhost>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={eventDate}
                          onSelect={setEventDate}
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500 font-medium">
                      Hora
                    </Label>
                    <Select value={eventTime} onValueChange={setEventTime}>
                      <SelectTrigger className="w-full border-slate-200 bg-white shadow-sm h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t} hs
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs text-slate-500 font-medium">
                      Ubicación
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <TextInput
                        name="eventLocation"
                        className="pl-9 h-9 bg-white"
                        placeholder="Ej: Plaza Independencia"
                        value={eventLocation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEventLocation(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <ButtonGhost onClick={() => setOpen(false)}>Cancelar</ButtonGhost>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing
              ? "Guardar Cambios"
              : hasEvent
              ? "Publicar y Agendar"
              : "Publicar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

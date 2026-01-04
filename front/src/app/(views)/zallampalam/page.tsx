import { CalendarAlmanac } from "@/features/calendar/CalendarAlmanac";
import { MobileHeader } from "@/shared/components/MobileHeader";
import { createClient } from "@/lib/supabaseServer";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ZallampalamPage() {
  const supabase = await createClient();

  const { data: eventsData } = await supabase
    .from("calendar_events")
    .select("*")
    .order("date", { ascending: true });

  const formattedEvents = (eventsData || []).map((ev) => {
    const eventDate = new Date(ev.date);
    return {
      id: ev.id,
      date: eventDate,
      title: ev.title,
      time: format(eventDate, "HH:mm") + " hs",
      location: ev.location || "Sin ubicación",
      type: ev.type || "info",
    };
  });

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8f8f9] pb-10">
      <MobileHeader
        title="Calendario Zallampalam"
        subtitle="Ciclos y Eventos"
      />

      <CalendarAlmanac events={formattedEvents} />
    </div>
  );
}

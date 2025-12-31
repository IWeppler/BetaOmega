import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface Sanzhei {
  id: number;
  content: string;
  author?: string;
}

interface SanzheiState {
  sanzhei: Sanzhei | null;
  hasSeenToday: boolean;
  isLoading: boolean;
  fetchDailySanzhei: () => Promise<void>;
  markAsSeen: () => void;
}

export const useSanzheiStore = create<SanzheiState>((set) => ({
  sanzhei: null,
  hasSeenToday: false,
  isLoading: true, // Empezamos cargando

  fetchDailySanzhei: async () => {
    const today = new Date().toLocaleDateString("en-CA");

    // 1. Revisar LocalStorage
    const storedDate = localStorage.getItem("betaomega_sanzhei_date");
    const storedContent = localStorage.getItem("betaomega_sanzhei_content");
    const storedSeenStatus = localStorage.getItem("betaomega_sanzhei_seen");

    // Si ya tenemos datos DE HOY, usamos caché y terminamos
    if (storedDate === today && storedContent) {
      set({
        sanzhei: JSON.parse(storedContent),
        hasSeenToday: storedSeenStatus === "true",
        isLoading: false,
      });
      return;
    }

    // 2. Si es un nuevo día, buscamos en Supabase
    try {
      set({ isLoading: true });
      const { data, error } = await supabase.rpc("get_random_sanzhen");

      if (error) throw error;

      if (data && data.length > 0) {
        const newSanzhei = data[0];

        // Guardamos en LocalStorage
        localStorage.setItem("betaomega_sanzhei_date", today);
        localStorage.setItem(
          "betaomega_sanzhei_content",
          JSON.stringify(newSanzhei)
        );
        localStorage.setItem("betaomega_sanzhei_seen", "false");

        // Actualizamos Store
        set({
          sanzhei: newSanzhei,
          hasSeenToday: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error obteniendo Sanzhei:", error);
      set({ isLoading: false });
    }
  },

  markAsSeen: () => {
    localStorage.setItem("betaomega_sanzhei_seen", "true");
    set({ hasSeenToday: true });

    // Opcional: Actualizar racha en DB (sin await para no bloquear UI)
    supabase.rpc("update_user_streak");
  },
}));

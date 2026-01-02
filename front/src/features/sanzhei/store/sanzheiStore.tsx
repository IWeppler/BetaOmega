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
  currentUserId: string | null; // NUEVO: Guardamos el ID en el estado
  fetchDailySanzhei: (userId?: string) => Promise<void>;
  markAsSeen: () => void;
}

const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const useSanzheiStore = create<SanzheiState>((set, get) => ({
  sanzhei: null,
  hasSeenToday: false,
  isLoading: true,
  currentUserId: null,

  fetchDailySanzhei: async (userId?: string) => {
    const today = new Date().toLocaleDateString("en-CA");

    // Guardamos el userId en el estado para usarlo luego en markAsSeen
    set({ currentUserId: userId || null });

    const storageKeySuffix = userId ? `_${userId}` : "";

    const storedDate = localStorage.getItem(
      `betaomega_sanzhei_date${storageKeySuffix}`
    );
    const storedContent = localStorage.getItem(
      `betaomega_sanzhei_content${storageKeySuffix}`
    );
    const storedSeenStatus = localStorage.getItem(
      `betaomega_sanzhei_seen${storageKeySuffix}`
    );

    // 1. Caché Local
    if (storedDate === today && storedContent) {
      set({
        sanzhei: JSON.parse(storedContent),
        hasSeenToday: storedSeenStatus === "true",
        isLoading: false,
      });
      return;
    }

    // 2. Fetch
    try {
      set({ isLoading: true });

      const TABLE_NAME = "sanzhens";

      const { data: allIds, error: countError } = await supabase
        .from(TABLE_NAME)
        .select("id");

      if (countError || !allIds || allIds.length === 0) throw countError;

      const seedString = `${today}-${userId || "guest"}`;
      const seedNumber = seededRandom(seedString);

      const targetIndex = seedNumber % allIds.length;
      const targetId = allIds[targetIndex].id;

      const { data: sanzheiData, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", targetId)
        .single();

      if (fetchError) throw fetchError;

      if (sanzheiData) {
        localStorage.setItem(
          `betaomega_sanzhei_date${storageKeySuffix}`,
          today
        );
        localStorage.setItem(
          `betaomega_sanzhei_content${storageKeySuffix}`,
          JSON.stringify(sanzheiData)
        );
        // Inicializamos en false explícitamente si es nuevo día
        localStorage.setItem(
          `betaomega_sanzhei_seen${storageKeySuffix}`,
          "false"
        );

        set({
          sanzhei: sanzheiData,
          hasSeenToday: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error obteniendo Sanzhei:", error);
      set({ isLoading: false });
    }
  },

  markAsSeen: async () => {
    // Recuperamos el userId del estado actual
    const { currentUserId } = get();
    const storageKeySuffix = currentUserId ? `_${currentUserId}` : "";

    // 1. Actualizamos UI inmediatamente
    set({ hasSeenToday: true });

    // 2. Guardamos en LocalStorage con la clave CORRECTA
    localStorage.setItem(`betaomega_sanzhei_seen${storageKeySuffix}`, "true");

    // 3. Solo llamamos a la DB si hay usuario logueado
    if (currentUserId) {
      try {
        await supabase.rpc("update_user_streak");
      } catch (error) {
        console.error("Error actualizando racha:", error);
      }
    }
  },
}));

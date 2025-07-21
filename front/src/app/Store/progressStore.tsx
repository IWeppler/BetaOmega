import { create } from "zustand";
import {
  fetchUserProgress,
  upsertUserProgress,
} from "@/services/progress.service";
import { IUserProgress, IUpsertProgressDto } from "@/interfaces";

type ProgressMap = Map<string, IUserProgress>;

interface ProgressState {
  progressMap: ProgressMap;
  loading: boolean;
  getUserProgress: (userId: string) => Promise<void>;
  updateBookProgress: (data: IUpsertProgressDto) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progressMap: new Map(),
  loading: false,

  getUserProgress: async (userId: string) => {
    if (!userId) return;
    set({ loading: true });
    try {
      const progressList = await fetchUserProgress(userId);
      const newMap: ProgressMap = new Map();
      progressList.forEach((p) => newMap.set(p.book_id, p));
      set({ progressMap: newMap, loading: false });
    } catch (error) {
      console.error("Error al cargar el progreso del usuario:", error);
      set({ loading: false });
    }
  },

  updateBookProgress: async (data: IUpsertProgressDto) => {
    try {
      const updatedProgress = await upsertUserProgress(data);
      if (updatedProgress) {
        const newMap = new Map(get().progressMap);
        newMap.set(updatedProgress.book_id, updatedProgress);
        set({ progressMap: newMap });
      }
    } catch (error) {
      console.error("Error al actualizar el progreso del libro:", error);
    }
  },
}));

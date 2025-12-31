import { create } from "zustand";
import {
  fetchUserProgress,
  upsertUserProgress,
} from "@/services/progress.service";
import { IUserProgress, IUpsertProgressDto } from "@/interfaces";
import { supabase } from "@/lib/supabaseClient";

type ProgressMap = Map<string, IUserProgress>;

interface ProgressState {
  progressMap: ProgressMap;
  loading: boolean;
  getUserProgress: (userId: string) => Promise<void>;
  updateBookProgress: (data: IUpsertProgressDto) => Promise<void>;
  updateProgress: (
    bookId: string,
    chapterNumber: number,
    currentPage: number
  ) => Promise<void>;
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
    const currentMap = get().progressMap;
    const existingProgress = currentMap.get(data.book_id);

    const optimisticProgress: IUserProgress = {
      id: existingProgress?.id || -1,
      user_id: data.user_id,
      book_id: data.book_id,
      current_page: data.current_page,
      updated_at: new Date().toISOString(),
      is_completed: data.is_completed || false,
      current_chapter: data.chapter_number || data.current_chapter || 1,
      chapter_number: data.chapter_number || data.current_chapter || 1,
      progress: data.is_completed ? 100 : existingProgress?.progress || 0,
    };

    const newMap = new Map(currentMap);
    newMap.set(data.book_id, optimisticProgress);
    set({ progressMap: newMap });

    try {
      const result = await upsertUserProgress(data);

      if (result) {
        const confirmedMap = new Map(get().progressMap);
        confirmedMap.set(result.book_id, result);
        set({ progressMap: confirmedMap });
      }
    } catch (error) {
      console.error("Error al actualizar el progreso del libro:", error);
    }
  },

  updateProgress: async (
    bookId: string,
    chapterNumber: number,
    currentPage: number
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const currentMap = get().progressMap;
    const existingProgress = currentMap.get(bookId);

    if (existingProgress?.is_completed) {
      return;
    }

    if (existingProgress && chapterNumber < existingProgress.current_chapter) {
      return;
    }

    const dto: IUpsertProgressDto = {
      user_id: user.id,
      book_id: bookId,
      chapter_number: chapterNumber,
      current_chapter: chapterNumber,
      current_page: currentPage,
      is_completed: existingProgress?.is_completed || false,
    };

    await get().updateBookProgress(dto);
  },
}));

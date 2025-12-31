import { supabase } from "@/lib/supabaseClient";
import { IUserProgress, IUpsertProgressDto } from "@/interfaces";

export const fetchUserProgress = async (
  userId: string
): Promise<IUserProgress[]> => {
  try {
    const { data, error } = await supabase
      .from("reading_progress")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data as IUserProgress[];
  } catch (error) {
    console.error("Error fetching progress:", error);
    return [];
  }
};

export const upsertUserProgress = async (
  progressData: IUpsertProgressDto
): Promise<IUserProgress | null> => {
  const payload = {
    user_id: progressData.user_id,
    book_id: progressData.book_id,
    current_page: progressData.current_page,
    is_completed: progressData.is_completed,
    updated_at: new Date().toISOString(),
    current_chapter:
      progressData.chapter_number || progressData.current_chapter || 1,
  };

  try {
    const { data: result, error } = await supabase
      .from("reading_progress")
      .upsert(payload, { onConflict: "user_id, book_id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase Error:", error.message, error.details);
      throw error;
    }
    return result as IUserProgress;
  } catch (error) {
    console.error("Error crítico al guardar progreso:", error);
    return null;
  }
};

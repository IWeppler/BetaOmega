import { supabase } from "@/lib/supabaseClient";

export interface ICreatePostDto {
  title: string;
  content: string;
  category_id: number;
  image_url?: string;
  is_pinned?: boolean;
  event?: {
    date: string;
    location: string;
    type: string;
  } | null;
}

export const createPost = async (postData: ICreatePostDto) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // 1. Insertar el POST
    const { data: newPost, error: postError } = await supabase
      .from("posts")
      .insert({
        title: postData.title,
        content: postData.content,
        category_id: postData.category_id,
        image_url: postData.image_url,
        is_pinned: postData.is_pinned || false,
        created_by: user.id,
      })
      .select()
      .single();

    if (postError) throw postError;

    // 2. Insertar el EVENTO
    if (postData.event) {
      const { error: eventError } = await supabase
        .from("calendar_events")
        .insert({
          title: postData.title,
          date: postData.event.date,
          location: postData.event.location,
          type: postData.event.type,
          created_by: user.id,
          post_id: newPost.id,
        });

      if (eventError) {
        console.error("Error creando el evento vinculado:", eventError);
      }
    }

    return { success: true, post: newPost };
  } catch (error) {
    console.error("Error creando post:", error);
    let message = "Error desconocido al crear el post";
    if (error instanceof Error) message = error.message;
    else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      message = String((error as { message: unknown }).message);
    }
    return { success: false, error: message };
  }
};

export const updatePost = async (postId: number, postData: ICreatePostDto) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    // 1. Actualizar el POST
    const { data: updatedPost, error: postError } = await supabase
      .from("posts")
      .update({
        title: postData.title,
        content: postData.content,
        category_id: postData.category_id,
        image_url: postData.image_url,
        is_pinned: postData.is_pinned || false,
      })
      .eq("id", postId)
      .select()
      .single();

    if (postError) throw postError;

    // 2. Manejar el EVENTO
    if (postData.event) {
      const { data: existingEvent } = await supabase
        .from("calendar_events")
        .select("id")
        .eq("post_id", postId)
        .single();

      if (existingEvent) {
        // Actualizar existente
        await supabase
          .from("calendar_events")
          .update({
            title: postData.title,
            date: postData.event.date,
            location: postData.event.location,
            type: postData.event.type,
          })
          .eq("id", existingEvent.id);
      } else {
        await supabase.from("calendar_events").insert({
          title: postData.title,
          date: postData.event.date,
          location: postData.event.location,
          type: postData.event.type,
          created_by: user.id,
          post_id: postId,
        });
      }
    } else {
      await supabase.from("calendar_events").delete().eq("post_id", postId);
    }

    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Error actualizando post:", error);
    // ... (mismo manejo de errores que createPost)
    return { success: false, error: "Error al actualizar" };
  }
};

export const deletePost = async (postId: number) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  return { success: !error, error };
};

export const uploadPostImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("post-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error subiendo imagen de post:", error);
    return null;
  }
};

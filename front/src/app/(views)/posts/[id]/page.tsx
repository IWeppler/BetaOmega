import { createClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { IPost, ICategory, IGlossaryTerm } from "@/interfaces"; // Asegúrate de importar IGlossaryTerm
import { Metadata } from "next";
import { MobileHeader } from "@/shared/components/MobileHeader";
import { routes } from "@/app/routes";
import { PostQuestions } from "@/features/post/PostQuestion";
import { PostActions } from "@/features/post/components/PostActions";
import { GlossaryRenderer } from "@/shared/components/GlossaryRenderer";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, content")
    .eq("id", id)
    .single();

  if (!post) {
    return {
      title: "Post no encontrado",
    };
  }

  return {
    title: `${post.title} | Beta & Omega`,
    description:
      post.content?.substring(0, 150).replace(/<[^>]+>/g, "") + "...",
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin" || profile?.role === "superadmin";
  }

  // CORRECCIÓN AQUÍ: Traemos 3 cosas (Post, Categorías y Glosario)
  const [postResponse, categoriesResponse, glossaryResponse] =
    await Promise.all([
      supabase.from("posts").select(`*, categories (*)`).eq("id", id).single(),
      supabase.from("categories").select("*").order("name"), // Necesario para PostActions (edición)
      supabase.from("glossary_terms").select("*"), // Necesario para GlossaryRenderer (lectura)
    ]);

  const { data: post, error } = postResponse;
  const { data: categories } = categoriesResponse;
  const { data: glossary } = glossaryResponse;

  if (error || !post) {
    notFound();
  }

  const postData = post as unknown as IPost & { categories: ICategory };

  // Preparamos las listas con tipos correctos
  const categoriesList = (categories as ICategory[]) || [];
  const glossaryList = (glossary as IGlossaryTerm[]) || [];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8f8f9]">
      <MobileHeader
        title="Post"
        subtitle={postData.title}
        showBackButton={true}
        backUrl={routes.home}
      />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
        <article className="bg-[#fefeff] rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <header className="p-4 border-b border-neutral-200 bg-[#fefeff]">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  {postData.categories && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider block max-w-28 border ${postData.categories.color_class
                        .replace("bg-", "text-")
                        .replace("text-", "border-")}`}
                    >
                      {postData.categories.name}
                    </span>
                  )}
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(postData.created_at), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {postData.title}
                </h1>
              </div>

              {isAdmin && (
                <div className="shrink-0 mt-1">
                  <PostActions
                    post={postData}
                    categories={categoriesList} // Usa categorías para editar
                    isAdmin={isAdmin}
                  />
                </div>
              )}
            </div>
          </header>

          {/* Cuerpo del Contenido */}
          <div className="p-4">
            <div
              className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md"
            >
              {/* Aquí usamos el Glosario para renderizar */}
              <GlossaryRenderer
                content={postData.content}
                terms={glossaryList}
              />
            </div>
          </div>
        </article>

        {/* Sección de Preguntas */}
        <PostQuestions postId={postData.id.toString()} />
      </div>
    </div>
  );
}

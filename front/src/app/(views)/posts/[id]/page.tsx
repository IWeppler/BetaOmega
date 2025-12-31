import { createClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { IPost, ICategory } from "@/interfaces";
import { Metadata } from "next";
import { MobileHeader } from "@/shared/components/MobileHeader";
import { routes } from "@/app/routes";
import { PostQuestions } from "@/features/post/PostQuestion";

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

  // Obtenemos el post y su categoría
  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      categories (*)
    `
    )
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  const postData = post as unknown as IPost & { categories: ICategory };

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50/50">
      <MobileHeader
        title="Post"
        subtitle={postData.title}
        showBackButton={true}
        backUrl={routes.home}
      />

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
        <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <header className="p-6 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3 mb-4">
              {postData.categories && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${postData.categories.color_class
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
          </header>

          {/* Cuerpo del Contenido */}
          <div className="p-6">
            <div
              className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </div>
        </article>

        {/* Sección de Preguntas */}
        <PostQuestions postId={postData.id.toString()} />
      </div>
    </div>
  );
}

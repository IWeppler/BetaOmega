"use client";

import { useState } from "react";
import { IPost, ICategory } from "@/interfaces";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Pin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface PostListItemProps {
  post: IPost;
  category?: ICategory;
}

export const PostListItem = ({ post, category }: PostListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Umbral base para mostrar botón "Leer más" (aprox 3 líneas)
  const isLongContent = post.content.length > 250;

  return (
    <div
      className={`group relative flex flex-col gap-3 p-5 rounded-xl border transition-all duration-200 bg-white hover:border-slate-300 ${
        post.is_pinned
          ? "border-yellow-200 bg-yellow-50/30"
          : "border-slate-100"
      }`}
    >
      {/* 1. Encabezado */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {category && (
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border ${category.color_class
                .replace("bg-", "text-")
                .replace("text-", "border-")}`}
            >
              {category.name}
            </span>
          )}
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>

        {post.is_pinned && (
          <Pin className="h-4 w-4 text-yellow-500 fill-yellow-500 rotate-45" />
        )}
      </div>

      {/* 2. Título */}
      <Link href={`/posts/${post.id}`} className="block w-fit">
        <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer">
          {post.title}
        </h3>
      </Link>

      {/* 3. Contenido  */}
      <div className="relative">
        <div
          className={`prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed transition-all duration-300 ease-in-out ${
            !isExpanded
              ? "max-h-[90px] overflow-hidden"
              : "max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Gradiente de desvanecimiento */}
        {!isExpanded && isLongContent && (
          <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Botón Toggle */}
      {isLongContent && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 w-fit mt-1 z-10 relative focus:outline-none cursor-pointer"
        >
          {isExpanded ? (
            <>
              Mostrar menos <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Leer más <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

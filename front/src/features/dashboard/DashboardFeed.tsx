"use client";

import { useState, useEffect } from "react";
import { IPost, ICategory } from "@/interfaces";
import { PostListItem } from "@/features/post/PostListItem";
import { PostFormModal } from "@/features/post/PostFormModal";
import { Search } from "lucide-react";
import { TextInput } from "@/shared/ui/Input";
import { useAuthStore } from "@/features/auth/store/authStore";

interface Props {
  posts: IPost[];
  categories: ICategory[];
}

export const DashboardFeed = ({ posts, categories }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // 2. Obtener el usuario del store
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  // 3. Verificar si es admin
  const isAdmin = user?.role === "admin";

  // Lógica de filtrado
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.category_id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* 1. Barra de Herramientas  */}
      <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-row justify-center items-center gap-3">
          {" "}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <TextInput
              name="search"
              placeholder="Buscar publicaciones, anuncios, temas..."
              className="w-full pl-2 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <div className="shrink-0">
              <PostFormModal categories={categories} isAdmin={isAdmin} />
            </div>
          )}
        </div>

        {/* Filtros de Categoría */}
        <div className="w-full bg-white md:bg-transparent py-2 sticky top-16 md:top-0 z-30">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
            {/* Botón  */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === null
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Todo
            </button>

            {/* Mapeo de Categorías */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Lista de Resultados */}
      <div className="space-y-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostListItem
              key={post.id}
              post={post}
              category={categories.find((c) => c.id === post.category_id)}
            />
          ))
        ) : (
          <div className="text-center py-12 text-slate-400">
            No se encontraron publicaciones.
          </div>
        )}
      </div>
    </div>
  );
};

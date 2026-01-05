"use client";

import { useState } from "react";
import { IPost, ICategory } from "@/interfaces";
import { PostListItem } from "@/features/post/PostListItem";
import { PostFormModal } from "@/features/post/PostFormModal";
import { Search } from "lucide-react";
import { TextInput } from "@/shared/ui/Input";
import { useAuthStore } from "@/features/auth/store/authStore";
import clsx from "clsx";
import BannerBlock from "./BannerBlock"; // Importamos el componente limpio

interface Props {
  posts: IPost[];
  categories: ICategory[];
}

export const DashboardFeed = ({ posts, categories }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  // 1. Lógica de Filtrado (CENTRALIZADA AQUÍ)
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? post.category_id === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // 2. Lógica de visualización
  const displayedPosts = user ? filteredPosts : filteredPosts.slice(0, 2);

  // 3. Condición para mostrar el Banner:
  // - No hay usuario
  // - Y hay posts que coinciden con la búsqueda (si la búsqueda no da resultados, no mostramos el candado de "hay más")
  const showBanner = !user && filteredPosts.length > 0;

  return (
    <div className="space-y-6">
      {/* Barra de Herramientas */}
      <div className="space-y-4 bg-[#e7e2e0] p-4 rounded-xl border border-neutral-300 shadow-sm">
        {/* ... (Tu código del buscador y filtros igual que antes) ... */}
         <div className="flex flex-row justify-center items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <TextInput
              name="search"
              placeholder="Buscar publicaciones..."
              className="w-full pl-2 pr-4 py-3 bg-[#fefeff] border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
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
        <div className="w-full bg-transparent py-2 sticky top-16 md:top-0 z-30">
            {/* ... Tus botones de filtros ... */}
             <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === null
                  ? "bg-slate-900 text-[#fefeff] shadow-md"
                  : "bg-[#fefeff] text-neutral-600 border border-neutral-200"
              }`}
            >
              Todo
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-[#fefeff] shadow-md"
                    : "bg-[#fefeff] text-neutral-600 border border-neutral-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Resultados */}
      <div className="space-y-3 pb-10 relative">
        {displayedPosts.length > 0 ? (
          <>
            {displayedPosts.map((post, index) => (
              <div
                key={post.id}
                className={clsx(
                   // Usamos showBanner para saber si debemos desvanecer el último elemento
                  showBanner &&
                    index === displayedPosts.length - 1 &&
                    "mask-linear-fade opacity-50 pointer-events-none select-none"
                )}
              >
                <PostListItem
                  post={post}
                  category={categories.find((c) => c.id === post.category_id)}
                />
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-12 text-neutral-400">
            No se encontraron publicaciones.
          </div>
        )}

        {showBanner && <BannerBlock />}
      </div>
    </div>
  );
};
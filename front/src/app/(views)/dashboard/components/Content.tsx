"use client";

import { useState, useEffect } from "react";
import { useBookStore } from "@/app/Store/bookStore";
import { Loader2 } from "lucide-react";
import { BookCoverView } from "@/components/BookCoverView";
import { BookReadingView } from "@/components/BookView";
import { WelcomeMessage } from "@/components/WelcomeMessage";

interface ContentProps {
  slug: string | null;
}

export function Content({ slug }: ContentProps) {
  const { currentBook, loading, fetchBookBySlug, clearCurrentBook } =
    useBookStore();
  const [viewMode, setViewMode] = useState<"cover" | "content">("cover");

  useEffect(() => {
    if (slug) {
      fetchBookBySlug(slug);
      setViewMode("cover");
    } else {
      clearCurrentBook();
    }
    return () => clearCurrentBook();
  }, [slug, fetchBookBySlug, clearCurrentBook]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!slug || !currentBook) {
    return <WelcomeMessage />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <h1 className="font-semibold text-gray-900">Dashboard Educativo</h1>
        <span className="text-gray-500">/</span>
        <span className="text-gray-500">{currentBook.title}</span>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-[#f9f7f5] to-white">
        {viewMode === "cover" ? (
          <BookCoverView
            book={currentBook}
            onStartReading={() => setViewMode("content")}
          />
        ) : (
          <BookReadingView
            book={currentBook}
            onClose={() => setViewMode("cover")}
          />
        )}
      </main>
    </div>
  );
}

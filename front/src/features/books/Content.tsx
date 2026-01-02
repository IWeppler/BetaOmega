"use client";

import { useState, useEffect } from "react";
import { useBookStore } from "@/features/books/store/bookStore";
import { useProgressStore } from "@/features/user/store/progressStore";
import { Loader2 } from "lucide-react";
import { BookCoverView } from "@/features/books/BookCoverView";
import { BookReadingView } from "@/features/books/BookView";
import { MobileHeader } from "@/shared/components/MobileHeader";

interface ContentProps {
  slug: string | null;
}

export function Content({ slug }: ContentProps) {
  const { currentBook, loading, fetchBookBySlug, clearCurrentBook } =
    useBookStore();
  const { progressMap } = useProgressStore();

  const [viewMode, setViewMode] = useState<"cover" | "content">("cover");
  const [startAtChapter, setStartAtChapter] = useState(1);

  useEffect(() => {
    if (slug) {
      fetchBookBySlug(slug);
      setViewMode("cover");
    } else {
      clearCurrentBook();
    }
    return () => clearCurrentBook();
  }, [slug, fetchBookBySlug, clearCurrentBook]);

  const handleStartReading = () => {
    if (!currentBook) return;

    const userProgress = progressMap.get(currentBook.id);

    const resumeChapter =
      userProgress?.current_chapter || userProgress?.chapter_number || 1;

    console.log("📍 Reanudando lectura en capítulo:", resumeChapter);

    setStartAtChapter(resumeChapter);
    setViewMode("content");
  };

  // --- LÓGICA DE SELECCIÓN MANUAL ---
  const handleChapterSelect = (chapterNumber: number) => {
    console.log("👆 Seleccionado capítulo manual:", chapterNumber);
    setStartAtChapter(chapterNumber);
    setViewMode("content");
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!slug || !currentBook) {
    return <div className="h-full w-full bg-[#f9f7f5]" />;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#f9f7f5] relative">
      <MobileHeader title={currentBook.title} subtitle='' />
      <div className="flex-1 h-full overflow-y-auto p-2 sm:p-6 pb-20 scroll-smooth custom-scrollbar">
        {viewMode === "cover" ? (
          <BookCoverView
            book={currentBook}
            onStartReading={handleStartReading}
            onChapterSelect={handleChapterSelect}
          />
        ) : (
          <BookReadingView
            book={currentBook}
            onClose={() => setViewMode("cover")}
            startAtChapter={startAtChapter}
          />
        )}
      </div>
    </div>
  );
}

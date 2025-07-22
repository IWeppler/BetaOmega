"use client";

import { useEffect, useState } from "react";
import { IBook } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useProgressStore } from "@/app/Store/progressStore";
import { useAuthStore } from "@/app/Store/authStore";
interface BookReadingViewProps {
  book: IBook;
  onClose: () => void;
  startAtChapter: number;
}

export const BookReadingView = ({ book, onClose, startAtChapter }: BookReadingViewProps) => {
  const { user } = useAuthStore();
  const { progressMap, updateBookProgress } = useProgressStore();

  const initialChapter = progressMap.get(book.id)?.chapter_number || 1;

  const [currentChapterNumber, setCurrentChapterNumber] = useState(initialChapter);

  useEffect(() => {
    setCurrentChapterNumber(startAtChapter);
  }, [startAtChapter]);

  const handleProgressUpdate = (newChapter: number) => {
    if (!user) return;
    updateBookProgress({
      user_id: user.id,
      book_id: book.id,
      current_chapter: newChapter,
    });
  };

  const goToNextChapter = () => {
    const nextChapter = Math.min(currentChapterNumber + 1, book.total_chapters);
    setCurrentChapterNumber(nextChapter);
    handleProgressUpdate(nextChapter);
  };

  const goToPrevChapter = () => {
    const prevChapter = Math.max(currentChapterNumber - 1, 1);
    setCurrentChapterNumber(prevChapter);
    handleProgressUpdate(prevChapter);
  };

  const currentChapter = book.contents.find(
    (c) => c.chapter_number === currentChapterNumber
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <Button
        onClick={onClose}
        variant="outline"
        className="mb-6 hover:bg-gray-100 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la portada
      </Button>
      <article className="prose max-w-none mb-8">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {currentChapter?.md_content || "Contenido no encontrado."}
        </ReactMarkdown>
      </article>

      {/* Navegación de Capítulos */}
      <div className="flex justify-between items-center border-t pt-4">
        <Button
          onClick={goToPrevChapter}
          disabled={currentChapterNumber <= 1}
          variant="outline"
          className="hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>
        <span className="text-sm font-medium text-gray-600">
          Capítulo {currentChapterNumber} de {book.total_chapters}
        </span>
        <Button
          onClick={goToNextChapter}
          disabled={currentChapterNumber >= book.total_chapters}
          variant="outline"
          className="hover:bg-gray-100 cursor-pointer"
        >
          Siguiente
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
